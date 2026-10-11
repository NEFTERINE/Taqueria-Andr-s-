const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors()); // Permite que tu frontend en React (puerto 5173) se comunique con este backend (puerto 3000)
app.use(express.json()); // Permite recibir datos en formato JSON desde los formularios de React

// =====================================================================
// === 1. CONFIGURACIÓN DE BASE DE DATOS (PostgreSQL)
// =====================================================================
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Probar conexión a la BD al iniciar el servidor
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error adquiriendo cliente de la base de datos', err.stack);
  }
  console.log('¡Conexión exitosa a la base de datos PostgreSQL!');
  release();
});

// =====================================================================
// === 2. MIDDLEWARES DE SEGURIDAD (Tokens y Roles)
// =====================================================================

// Middleware para verificar si el usuario tiene un Token JWT válido
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ mensaje: 'Se requiere un token de autenticación para acceder.' });
  }

  try {
    // Se espera que el token venga en el header como: "Bearer <tu_token_aqui>"
    const tokenLimpio = token.split(" ")[1];
    const decodificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    
    // Guardamos los datos decodificados del usuario en la request para usarlos en la ruta final
    req.usuario = decodificado;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
};

// Middleware para proteger rutas según el rol del usuario (Ej. Solo Administrador)
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        mensaje: 'Acceso denegado: Tu rol no tiene permisos para realizar esta acción.' 
      });
    }
    next();
  };
};

// =====================================================================
// === 3. RUTAS DEL SISTEMA (Endpoints)
// =====================================================================

/**
 * Endpoint de Login (Ruta: http://localhost:3000/api/login)
 * Recibe: nombre_usuario, contrasena
 * Devuelve: Datos del usuario y Token JWT
 */
app.post('/api/login', async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  if (!nombre_usuario || !contrasena) {
    return res.status(400).json({ mensaje: 'Por favor ingresa usuario y contraseña.' });
  }

  try {
    // 1. Buscar al usuario en la base de datos y traer también el nombre de su rol
    const consulta = `
      SELECT u.*, r.nombre_rol 
      FROM public.usuario u
      JOIN public.rol r ON u.fk_rol = r.pk_rol
      WHERE u.nombre_usuario = $1 AND u.estatus = 1
    `;
    const resultado = await pool.query(consulta, [nombre_usuario]);

    if (resultado.rows.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado o inactivo.' });
    }

    const usuario = resultado.rows[0];

    // 2. Comparar la contraseña enviada desde React con el Hash almacenado en Postgres (bcrypt)
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta.' });
    }

    // 3. Generar el Token JWT (JSON Web Token)
    const payload = {
      id: usuario.pk_usuario,
      nombre: usuario.nombre_completo,
      usuario: usuario.nombre_usuario,
      rol: usuario.nombre_rol
    };

    // El token durará 8 horas (una jornada laboral estándar de la taquería)
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    // 4. Enviar respuesta exitosa al Frontend (NO enviamos la contraseña de vuelta)
    res.json({
      mensaje: '¡Inicio de sesión exitoso!',
      token: token,
      usuario: payload 
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

/**
 * Endpoint para Crear Usuarios (Protegido: Solo Administrador)
 * Recibe: nombre_completo, nombre_usuario, contrasena, rol
 */
app.post('/api/usuarios', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  const { nombre_completo, nombre_usuario, contrasena, rol } = req.body;

  // Validación básica
  if (!nombre_completo || !nombre_usuario || !contrasena || !rol) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
  }

  try {
    // 1. Obtener el ID del rol seleccionado desde la base de datos
    const consultaRol = 'SELECT pk_rol FROM public.rol WHERE nombre_rol = $1';
    const resultadoRol = await pool.query(consultaRol, [rol]);

    if (resultadoRol.rows.length === 0) {
      return res.status(400).json({ mensaje: 'Rol no válido.' });
    }
    const fk_rol = resultadoRol.rows[0].pk_rol;

    // 2. ENCRIPTAR LA CONTRASEÑA (Magia de bcrypt con 10 rondas de salting)
    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

    // 3. Insertar el usuario en la base de datos con el hash seguro
    const consultaInsertar = `
      INSERT INTO public.usuario (nombre_completo, nombre_usuario, contrasena, fk_rol)
      VALUES ($1, $2, $3, $4) RETURNING pk_usuario, nombre_completo, nombre_usuario
    `;
    const nuevoUsuario = await pool.query(consultaInsertar, [
      nombre_completo, 
      nombre_usuario, 
      contrasenaHasheada, 
      fk_rol
    ]);

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: nuevoUsuario.rows[0]
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    // Manejo del error si el nombre de usuario ya existe en postgres (violación UNIQUE)
    if (error.code === '23505') {
      return res.status(400).json({ mensaje: 'Error: El nombre de usuario ya está en uso.' });
    }
    res.status(500).json({ mensaje: 'Error interno al crear el usuario en la base de datos.' });
  }
});


//* =====================================================================
//? === RUTAS DEL MÓDULO DE USUARIOS (CRUD con Procedures y Functions)
//* =====================================================================

// 1. OBTENER TODOS LOS USUARIOS (Llama a función)
app.get('/api/usuarios', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM fn_obtener_usuarios()');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener la lista de usuarios' });
  }
});

// 2. CREAR UN NUEVO USUARIO (Reemplaza el código anterior de crear usuario)
app.post('/api/usuarios', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  const { nombre_completo, nombre_usuario, contrasena, rol } = req.body;

  if (!nombre_completo || !nombre_usuario || !contrasena || !rol) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);
    
    // Llamamos a la función SQL. Nos devolverá el ID asignado.
    const consulta = `SELECT fn_crear_usuario($1, $2, $3, $4) AS id_usuario`;
    const resultado = await pool.query(consulta, [nombre_completo, nombre_usuario, contrasenaHasheada, rol]);
    
    res.status(201).json({ mensaje: 'Usuario creado exitosamente', id_insertado: resultado.rows[0].id_usuario });
  } catch (error) {
    console.error('Error creando usuario:', error);
    if (error.code === '23505') return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
    res.status(500).json({ mensaje: 'Error interno del servidor al crear usuario' });
  }
});

// 3. ACTUALIZAR INFORMACIÓN DEL USUARIO (Llama a procedimiento)
app.put('/api/usuarios/:id', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  const { id } = req.params;
  const { nombre_completo, rol } = req.body;

  try {
    await pool.query('CALL sp_actualizar_usuario($1, $2, $3)', [id, nombre_completo, rol]);
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
  }
});

// 4. CAMBIAR ESTATUS (Activar/Desactivar) (Llama a procedimiento)
app.patch('/api/usuarios/:id/estatus', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('CALL sp_cambiar_estatus_usuario($1)', [id]);
    res.json({ mensaje: 'Estatus del usuario actualizado' });
  } catch (error) {
    console.error('Error cambiando estatus:', error);
    res.status(500).json({ mensaje: 'Error al cambiar estatus' });
  }
});

//* =====================================================================
//? === RUTAS DEL MÓDULO DE INVENTARIO (CRUD con Procedures y Functions)
//* =====================================================================

// 1. OBTENER TODOS LOS PRODUCTOS
// (Cualquier usuario logueado puede ver el menú, así que solo usamos verificarToken)
app.get('/api/inventario', verificarToken, async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM fn_obtener_productos()');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error obteniendo inventario:', error);
    res.status(500).json({ mensaje: 'Error al obtener el inventario' });
  }
});

// 2. CREAR UN NUEVO PRODUCTO (Protegido: Solo Administrador)
app.post('/api/inventario', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  const { nombre, descripcion, precio } = req.body;

  if (!nombre || precio === undefined) {
    return res.status(400).json({ mensaje: 'El nombre y el precio son obligatorios.' });
  }

  try {
    const consulta = `SELECT fn_crear_producto($1, $2, $3) AS id_producto`;
    const resultado = await pool.query(consulta, [nombre, descripcion || 'Sin descripción', precio]);
    
    res.status(201).json({ mensaje: 'Producto agregado exitosamente', id_insertado: resultado.rows[0].id_producto });
  } catch (error) {
    console.error('Error creando producto:', error);
    if (error.code === '23505') return res.status(400).json({ mensaje: 'Ya existe un producto con ese nombre' });
    if (error.code === 'P0001') return res.status(400).json({ mensaje: 'El precio no puede ser negativo' }); // Captura el Trigger
    res.status(500).json({ mensaje: 'Error interno al crear el producto' });
  }
});

// 3. ACTUALIZAR PRODUCTO (Protegido: Solo Administrador)
app.put('/api/inventario/:id', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;

  try {
    await pool.query('CALL sp_actualizar_producto($1, $2, $3, $4)', [id, nombre, descripcion, precio]);
    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el producto' });
  }
});

// 4. CAMBIAR ESTATUS (Protegido: Solo Administrador)
app.patch('/api/inventario/:id/estatus', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('CALL sp_cambiar_estatus_producto($1)', [id]);
    res.json({ mensaje: 'Estatus del producto actualizado' });
  } catch (error) {
    console.error('Error cambiando estatus:', error);
    res.status(500).json({ mensaje: 'Error al cambiar estatus' });
  }
});

//* =====================================================================
// === 4. INICIALIZACIÓN DEL SERVIDOR
//* =====================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo exitosamente en http://localhost:${PORT}`);
});
