--* Creación de tablas principales

CREATE TABLE public.rol (
    pk_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(20) NOT NULL UNIQUE,
    estatus SMALLINT DEFAULT 1
);

CREATE TABLE public.permiso (
    pk_permiso SERIAL PRIMARY KEY,
    nombre_permiso VARCHAR(50) NOT NULL, -- Aumenté tamaño por nombres más descriptivos
    modulo VARCHAR(30) NOT NULL,
    estatus SMALLINT DEFAULT 1
);

CREATE TABLE public.usuario (
    pk_usuario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(60) NOT NULL, -- Aumenté tamaño para nombres largos
    nombre_usuario VARCHAR(15) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL, -- Listo para almacenar hashes (bcrypt)
    estatus SMALLINT DEFAULT 1,
    fk_rol INTEGER NOT NULL REFERENCES public.rol(pk_rol)
);

CREATE TABLE public.inventario (
    pk_inventario SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(40) NOT NULL UNIQUE,
    descripcion VARCHAR(120) NOT NULL, -- Aumenté tamaño para descripciones más detalladas
    precio NUMERIC(5,2) NOT NULL CHECK (precio >= 0), -- 5 dígitos en total (ej. de 0.00 a 999.99)
    estatus SMALLINT DEFAULT 1
);

CREATE TABLE public.rol_permiso (
    pk_rol_permiso SERIAL PRIMARY KEY,
    fk_rol INTEGER NOT NULL REFERENCES public.rol(pk_rol) ON DELETE CASCADE,
    fk_permiso INTEGER NOT NULL REFERENCES public.permiso(pk_permiso) ON DELETE CASCADE
);

CREATE TABLE public.usuario_permiso (
    pk_usuario_permiso SERIAL PRIMARY KEY,
    fk_usuario INTEGER NOT NULL REFERENCES public.usuario(pk_usuario) ON DELETE CASCADE,
    fk_permiso INTEGER NOT NULL REFERENCES public.permiso(pk_permiso) ON DELETE CASCADE
);

--* --------------------------------------------------------
--? INSERCIONES PRIMARIAS PARA EL FUNCIONAMIENTO DEL SISTEMA
--* --------------------------------------------------------

-- 1. Insertar los Roles definidos en la entrevista
INSERT INTO public.rol (nombre_rol) VALUES
('Administrador'),
('Mesero'),
('Cocinero');

-- 2. Insertar los Permisos basados en las acciones requeridas
INSERT INTO public.permiso (nombre_permiso, modulo) VALUES
-- Módulo Usuarios
('Gestionar Usuarios (Crear, Editar, Activar)', 'Usuarios'),
('Ver Usuarios', 'Usuarios'),

-- Módulo Inventario
('Gestionar Productos (Crear, Editar)', 'Inventario'),
('Ver Productos', 'Inventario'),

-- Módulo Caja/Gastos
('Abrir/Cerrar Caja y Cortes', 'Caja'),
('Registrar Gastos del Día', 'Caja'),

-- Módulo Ventas/Pedidos
('Registrar y Editar Pedidos', 'Ventas'),
('Cobrar Pedidos', 'Ventas'),
('Ver Historial de Ventas', 'Ventas'),
('Ver y Gestionar Pedidos en Cocina', 'Cocina'),

-- Módulo Reportes
('Ver Reportes (Ganancias, Tiempos, Consumo)', 'Reportes');


-- 3. Asignar Permisos a los Roles (Valores por Defecto)

-- Asignar TODOS los permisos al Administrador (Rol 1)
INSERT INTO public.rol_permiso (fk_rol, fk_permiso)
SELECT 1, pk_permiso FROM public.permiso;

-- Asignar permisos al Mesero (Rol 2)
INSERT INTO public.rol_permiso (fk_rol, fk_permiso) VALUES
(2, (SELECT pk_permiso FROM public.permiso WHERE nombre_permiso = 'Registrar y Editar Pedidos')),
(2, (SELECT pk_permiso FROM public.permiso WHERE nombre_permiso = 'Cobrar Pedidos')),
-- (2, (SELECT pk_permiso FROM public.permiso WHERE nombre_permiso = 'Registrar Gastos del Día')),
-- (2, (SELECT pk_permiso FROM public.permiso WHERE nombre_permiso = 'Abrir/Cerrar Caja y Cortes'))
;

-- Asignar permisos al Cocinero (Rol 3)
INSERT INTO public.rol_permiso (fk_rol, fk_permiso) VALUES
(3, (SELECT pk_permiso FROM public.permiso WHERE nombre_permiso = 'Ver y Gestionar Pedidos en Cocina'));


-- 4. Crear el usuario Administrador inicial
-- RECORDATORIO: En producción, la contraseña DEBE ser un hash de bcrypt.
-- Aquí uso '$2b$10$wY9/w.r/Q./..' como representación de un hash para 'admin123'
INSERT INTO public.usuario (nombre_completo, nombre_usuario, contrasena, fk_rol)
VALUES ('Jefe Taquería', 'admin', '$2b$10$ISn1FbZeKMQAKNUBSzkV4OpqtNEEg8OupBo9/0qW/FSriD3caDNua', 1);


--* --------------------------------------------------------
--? FUNCIONES Y TRIGGERS DE VALIDACIÓN Y SEGURIDAD
--* --------------------------------------------------------

-- Validar creación/edición de usuario
CREATE OR REPLACE FUNCTION trg_validar_usuario()
RETURNS TRIGGER AS $$
BEGIN
    IF LENGTH(TRIM(NEW.nombre_usuario)) < 3 THEN
        RAISE EXCEPTION 'El nombre de usuario debe tener al menos 3 caracteres.';
    END IF;
    -- Verificación básica para asegurar que se está guardando un hash (los hashes bcrypt suelen empezar con $2)
    IF NEW.contrasena NOT LIKE '$2%' THEN
        RAISE EXCEPTION 'Error de seguridad: La contraseña debe ser procesada (hasheada) antes de guardarse.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_antes_guardar_usuario
BEFORE INSERT OR UPDATE ON public.usuario
FOR EACH ROW EXECUTE FUNCTION trg_validar_usuario();

-- Validar precios en el inventario (no permitir precios negativos)
CREATE OR REPLACE FUNCTION trg_validar_precio_inventario()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.precio < 0 THEN
        RAISE EXCEPTION 'El precio del producto no puede ser negativo.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_antes_guardar_inventario
BEFORE INSERT OR UPDATE ON public.inventario
FOR EACH ROW EXECUTE FUNCTION trg_validar_precio_inventario();

-- Procedimiento Almacenado de ejemplo para obtener los permisos reales de un usuario
-- Combina los permisos de su rol + los permisos individuales asignados
CREATE OR REPLACE FUNCTION get_permisos_usuario(p_usuario_id INT)
RETURNS TABLE (permiso_nombre VARCHAR) AS $$
BEGIN
    RETURN QUERY
    -- Permisos que vienen de su Rol
    SELECT p.nombre_permiso
    FROM public.usuario u
    JOIN public.rol_permiso rp ON u.fk_rol = rp.fk_rol
    JOIN public.permiso p ON rp.fk_permiso = p.pk_permiso
    WHERE u.pk_usuario = p_usuario_id
    UNION
    -- Permisos adicionales individuales (excepciones)
    SELECT p.nombre_permiso
    FROM public.usuario_permiso up
    JOIN public.permiso p ON up.fk_permiso = p.pk_permiso
    WHERE up.fk_usuario = p_usuario_id;
END;
$$ LANGUAGE plpgsql;


--* =====================================================================
--? PROCEDIMIENTOS ALMACENADOS Y FUNCIONES PARA USUARIOS
--* =====================================================================

-- 1. Función para Leer Usuarios (Trae el nombre del rol en vez de su ID numérico)
CREATE OR REPLACE FUNCTION fn_obtener_usuarios()
RETURNS TABLE (
    id_usuario INT,
    nombre_completo VARCHAR,
    nombre_usuario VARCHAR,
    rol VARCHAR,
    estatus VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.pk_usuario,
        u.nombre_completo,
        u.nombre_usuario,
        r.nombre_rol,
        CASE WHEN u.estatus = 1 THEN 'Activo' ELSE 'Inactivo' END::VARCHAR
    FROM public.usuario u
    JOIN public.rol r ON u.fk_rol = r.pk_rol
    ORDER BY u.pk_usuario DESC;
END;
$$ LANGUAGE plpgsql;

-- 2. Función para Insertar Usuario (Devuelve el ID generado)
CREATE OR REPLACE FUNCTION fn_crear_usuario(
    p_nombre_completo VARCHAR,
    p_nombre_usuario VARCHAR,
    p_contrasena VARCHAR,
    p_nombre_rol VARCHAR
) RETURNS INT AS $$
DECLARE
    v_fk_rol INT;
    v_nuevo_id INT;
BEGIN
    -- Obtenemos la llave foránea (FK) del rol usando su nombre ('Mesero', 'Administrador'...)
    SELECT pk_rol INTO v_fk_rol FROM public.rol WHERE nombre_rol = p_nombre_rol;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Error: El rol % no existe.', p_nombre_rol;
    END IF;

    -- Insertamos al usuario
    INSERT INTO public.usuario (nombre_completo, nombre_usuario, contrasena, fk_rol)
    VALUES (p_nombre_completo, p_nombre_usuario, p_contrasena, v_fk_rol)
    RETURNING pk_usuario INTO v_nuevo_id;

    RETURN v_nuevo_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Procedimiento para Editar Usuario (No edita la contraseña, solo datos y rol)
CREATE OR REPLACE PROCEDURE sp_actualizar_usuario(
    p_id INT,
    p_nombre_completo VARCHAR,
    p_nombre_rol VARCHAR
) AS $$
DECLARE
    v_fk_rol INT;
BEGIN
    SELECT pk_rol INTO v_fk_rol FROM public.rol WHERE nombre_rol = p_nombre_rol;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Error: El rol % no existe.', p_nombre_rol;
    END IF;

    UPDATE public.usuario 
    SET nombre_completo = p_nombre_completo,
        fk_rol = v_fk_rol
    WHERE pk_usuario = p_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Procedimiento para Cambiar Estatus (Activar/Desactivar)
CREATE OR REPLACE PROCEDURE sp_cambiar_estatus_usuario(
    p_id INT
) AS $$
BEGIN
    -- Si es 1 lo cambia a 0, si es 0 lo cambia a 1
    UPDATE public.usuario 
    SET estatus = CASE WHEN estatus = 1 THEN 0 ELSE 1 END
    WHERE pk_usuario = p_id;
END;
$$ LANGUAGE plpgsql;


--* =====================================================================
--? PROCEDIMIENTOS ALMACENADOS Y FUNCIONES PARA INVENTARIO
--* =====================================================================

-- 1. Función para Leer Productos
CREATE OR REPLACE FUNCTION fn_obtener_productos()
RETURNS TABLE (
    id_producto INT,
    nombre VARCHAR,
    descripcion VARCHAR,
    precio NUMERIC(5,2),
    estatus VARCHAR,
    ventas INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pk_inventario,
        nombre_producto,
        i.descripcion,
        i.precio,
        CASE WHEN i.estatus = 1 THEN 'Activo' ELSE 'Inactivo' END::VARCHAR,
        0 -- Este campo queda en 0 por ahora hasta que hagamos el módulo de Ventas
    FROM public.inventario i
    ORDER BY pk_inventario DESC;
END;
$$ LANGUAGE plpgsql;

-- 2. Función para Insertar Producto (Devuelve el ID generado)
CREATE OR REPLACE FUNCTION fn_crear_producto(
    p_nombre VARCHAR,
    p_descripcion VARCHAR,
    p_precio NUMERIC
) RETURNS INT AS $$
DECLARE
    v_nuevo_id INT;
BEGIN
    INSERT INTO public.inventario (nombre_producto, descripcion, precio)
    VALUES (p_nombre, p_descripcion, p_precio)
    RETURNING pk_inventario INTO v_nuevo_id;
    
    RETURN v_nuevo_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Procedimiento para Editar Producto
CREATE OR REPLACE PROCEDURE sp_actualizar_producto(
    p_id INT,
    p_nombre VARCHAR,
    p_descripcion VARCHAR,
    p_precio NUMERIC
) AS $$
BEGIN
    UPDATE public.inventario 
    SET nombre_producto = p_nombre,
        descripcion = p_descripcion,
        precio = p_precio
    WHERE pk_inventario = p_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Procedimiento para Cambiar Estatus (Activar/Desactivar)
CREATE OR REPLACE PROCEDURE sp_cambiar_estatus_producto(
    p_id INT
) AS $$
BEGIN
    UPDATE public.inventario 
    SET estatus = CASE WHEN estatus = 1 THEN 0 ELSE 1 END
    WHERE pk_inventario = p_id;
END;
$$ LANGUAGE plpgsql;