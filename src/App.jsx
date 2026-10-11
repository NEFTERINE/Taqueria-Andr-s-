import { useMemo, useState, useEffect } from 'react';
import { Boxes, Users, ShoppingCart, ClipboardList, BarChart3, Settings, LayoutDashboard, CircleDollarSign, X, Pencil, Power, Utensils, Plus, Search } from 'lucide-react';
import Login from './pages/Login.jsx';
import Inventario from './pages/Inventario.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Modal from './components/ui/Modal.jsx';

const nav = [
 {id:'inicio',label:'Resumen',icon:LayoutDashboard}, {id:'inventario',label:'Inventario',icon:Boxes},
 {id:'usuarios',label:'Usuarios',icon:Users}, {id:'ventas',label:'Ventas',icon:ShoppingCart},
 {id:'ordenes',label:'Órdenes',icon:ClipboardList}, {id:'reportes',label:'Reportes',icon:BarChart3},
 {id:'configuracion',label:'Configuración',icon:Settings}
];
const titulos = {inicio:'Resumen general',inventario:'Inventario de productos',usuarios:'Usuarios y permisos',ventas:'Ventas',ordenes:'Órdenes',reportes:'Reportes',configuracion:'Configuración'};

export default function App(){
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    if (token && usuarioGuardado) {
      setUsuarioActual(JSON.parse(usuarioGuardado));
    }
    setCargandoSesion(false);
  }, []);

  const [pagina, setPagina] = useState('inicio');
  const [menuAbierto, setMenuAbierto] = useState(false);
  
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [buscar, setBuscar] = useState('');
  
  const [nombre, setNombre] = useState(''); const [precio, setPrecio] = useState(''); const [descripcion, setDescripcion] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState(''); const [contrasena, setContrasena] = useState(''); const [rol, setRol] = useState('Administrador');
  const [editarProducto, setEditarProducto] = useState(null); const [editarUsuario, setEditarUsuario] = useState(null); const [aviso, setAviso] = useState('');
  
  const activos = productos.filter(p=>p.estatus==='Activo').length;
  const productosFiltrados = useMemo(()=>productos.filter(p=>(p.nombre+' '+p.descripcion).toLowerCase().includes(buscar.toLowerCase())),[productos,buscar]);
  const usuariosFiltrados = useMemo(()=>usuarios.filter(u=>(u.nombre+' '+u.rol).toLowerCase().includes(buscar.toLowerCase())),[usuarios,buscar]);
  
  function notificar(msg){setAviso(msg);setTimeout(()=>setAviso(''),2800)}

  function manejarLogin(datosUsuario) {
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
    setUsuarioActual(datosUsuario);
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuarioActual(null);
  }

  //* =========================================================
  //? === FUNCIONES CONECTADAS AL BACKEND (Módulo Usuarios) ===
  //* =========================================================

  const cargarUsuariosBD = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/usuarios', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsuarios(data.map(u => ({
          id: u.id_usuario,
          nombre: u.nombre_completo,
          nombreUsuario: u.nombre_usuario,
          rol: u.rol,
          estatus: u.estatus
        })));
      }
    } catch (error) {
      notificar('Error de red al cargar usuarios');
    }
  };

  // Cargar usuarios cuando se abre la página de usuarios
  useEffect(() => {
    if (usuarioActual && pagina === 'usuarios' && usuarioActual.rol === 'Administrador') {
      cargarUsuariosBD();
    }
  }, [pagina, usuarioActual]);

  async function crearUsuario(e) {
    e.preventDefault();
    if(!nombreUsuario.trim()) return;

    try {
      const res = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ nombre_completo: nombre, nombre_usuario: nombreUsuario, contrasena, rol })
      });
      
      const data = await res.json();
      if (res.ok) {
        notificar(data.mensaje);
        setNombre(''); setNombreUsuario(''); setContrasena(''); setRol('Administrador');
        cargarUsuariosBD(); 
      } else {
        notificar(data.mensaje);
      }
    } catch (err) {
      notificar('Error al conectar con el servidor');
    }
  }
  
  async function guardarUsuario(e) {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${editarUsuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ nombre_completo: editarUsuario.nombre, rol: editarUsuario.rol })
      });

      if (res.ok) {
        notificar('Usuario actualizado');
        setEditarUsuario(null);
        cargarUsuariosBD(); 
      }
    } catch (err) {
      notificar('Error al actualizar');
    }
  }

  async function cambiarEstatusUsuario(u) {
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${u.id}/estatus`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        notificar(`Estatus de ${u.nombreUsuario} actualizado`);
        cargarUsuariosBD(); 
      }
    } catch (err) {
      notificar('Error al cambiar estatus');
    }
  }

  //* =========================================================
  //? === FUNCIONES CONECTADAS AL BACKEND (Módulo Inventario) ===
  //* =========================================================

  const cargarInventarioBD = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/inventario', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProductos(data.map(p => ({
          id: p.id_producto,
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          estatus: p.estatus,
          ventas: p.ventas
        })));
      }
    } catch (error) {
      notificar('Error de red al cargar inventario');
    }
  };

  // Cargar inventario cuando el usuario abre la página de inventario
  useEffect(() => {
    if (usuarioActual && pagina === 'inventario') {
      cargarInventarioBD();
    }
  }, [pagina, usuarioActual]);

  async function agregarProducto(e) {
    e.preventDefault();
    if (!nombre.trim() || !precio || Number(precio) < 0) return;

    try {
      const res = await fetch('http://localhost:3000/api/inventario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ nombre: nombre.trim(), descripcion: descripcion.trim(), precio: Number(precio) })
      });
      
      const data = await res.json();
      if (res.ok) {
        notificar(data.mensaje);
        setNombre(''); setPrecio(''); setDescripcion('');
        cargarInventarioBD(); // Recarga la tabla de inmediato
      } else {
        notificar(data.mensaje);
      }
    } catch (err) {
      notificar('Error al conectar con el servidor');
    }
  }
  
  async function guardarProducto(e) {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/inventario/${editarProducto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          nombre: editarProducto.nombre, 
          descripcion: editarProducto.descripcion, 
          precio: Number(editarProducto.precio) 
        })
      });

      if (res.ok) {
        notificar('Producto actualizado');
        setEditarProducto(null);
        cargarInventarioBD(); 
      }
    } catch (err) {
      notificar('Error al actualizar');
    }
  }

  async function cambiarEstatusProducto(p) {
    try {
      const res = await fetch(`http://localhost:3000/api/inventario/${p.id}/estatus`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        notificar(`Estatus de ${p.nombre} actualizado`);
        cargarInventarioBD(); 
      }
    } catch (err) {
      notificar('Error al cambiar estatus');
    }
  }

  // =========================================================

  if(cargandoSesion) return null; 
  if(!usuarioActual) return <Login onLogin={manejarLogin} />;

  return (
    <div className="app-shell">
      <Sidebar 
        nav={nav} 
        pagina={pagina} 
        setPagina={id=>{setPagina(id);setBuscar('')}} 
        menuAbierto={menuAbierto} 
        setMenuAbierto={setMenuAbierto} 
        onLogout={cerrarSesion} 
        usuario={usuarioActual} 
      />
      <main className="main-area">
          <Header titulo={titulos[pagina]} setMenuAbierto={setMenuAbierto} usuario={usuarioActual} />
          <div className="content">
            {/*
            {pagina==='inventario'&&<Inventario productos={productosFiltrados} total={productos.length} activos={activos} buscar={buscar} setBuscar={setBuscar} nombre={nombre} setNombre={setNombre} precio={precio} setPrecio={setPrecio} descripcion={descripcion} setDescripcion={setDescripcion} agregarProducto={agregarProducto} editar={setEditarProducto} cambiarEstatus={p=>{setProductos(productos.map(x=>x.id===p.id?{...x,estatus:x.estatus==='Activo'?'Inactivo':'Activo'}:x));notificar('Estatus del producto actualizado')}}/>}
            */}
            {pagina==='inventario'&&<Inventario productos={productosFiltrados} total={productos.length} activos={activos} buscar={buscar} setBuscar={setBuscar} nombre={nombre} setNombre={setNombre} precio={precio} setPrecio={setPrecio} descripcion={descripcion} setDescripcion={setDescripcion} agregarProducto={agregarProducto} editar={setEditarProducto} cambiarEstatus={cambiarEstatusProducto}/>}
            
            {/* Aquí actualizamos el prop cambiarEstatus para que use nuestra nueva función */}
            {pagina==='usuarios'&&<Usuarios usuarios={usuariosFiltrados} total={usuarios.length} buscar={buscar} setBuscar={setBuscar} nombre={nombre} setNombre={setNombre} nombreUsuario={nombreUsuario} setNombreUsuario={setNombreUsuario} contrasena={contrasena} setContrasena={setContrasena} rol={rol} setRol={setRol} crearUsuario={crearUsuario} editar={setEditarUsuario} cambiarEstatus={cambiarEstatusUsuario}/>}
            
            {pagina!=='inventario'&&pagina!=='usuarios'&&<><div className="page-heading"><div><div className="eyebrow">TAQUERÍA ANDRÉS</div><h1>{titulos[pagina]}</h1><p>Administra la información de tu negocio desde este panel.</p></div></div>{pagina==='inicio'?<div className="stats-grid"><div className="stat-card"><span>Ventas de hoy</span><CircleDollarSign/><strong>$0.00</strong><small>Sin datos de BD</small></div><div className="stat-card"><span>Productos activos</span><Boxes/><strong>{activos}</strong><small>Disponibles para venta</small></div><div className="stat-card"><span>Usuarios registrados</span><Users/><strong>{usuarios.length}</strong><small>Cuentas del personal</small></div></div>:<section className="panel placeholder"><div className="panel-icon"><Settings size={22}/></div><h2>Módulo de {titulos[pagina].toLowerCase()}</h2><p>La navegación está lista. Este módulo puede desarrollarse por separado.</p><button className="btn-secondary" onClick={()=>setPagina('inventario')}>Ir al inventario</button></section>}</>}
            <Footer />
          </div>
      </main>
      
      {editarProducto&&<Modal titulo="Editar producto" descripcion="Actualiza la información del producto." cerrar={()=>setEditarProducto(null)} guardar={guardarProducto}><label>Nombre<input required value={editarProducto.nombre} onChange={e=>setEditarProducto({...editarProducto,nombre:e.target.value})}/></label><label>Descripción<input value={editarProducto.descripcion} onChange={e=>setEditarProducto({...editarProducto,descripcion:e.target.value})}/></label><label>Precio<input required type="number" min="0.01" step="0.01" value={editarProducto.precio} onChange={e=>setEditarProducto({...editarProducto,precio:e.target.value})}/></label></Modal>}
      
      {editarUsuario&&<Modal titulo="Editar usuario" descripcion="Modifica los datos y el rol de acceso." cerrar={()=>setEditarUsuario(null)} guardar={guardarUsuario}><label>Nombre completo<input required value={editarUsuario.nombre} onChange={e=>setEditarUsuario({...editarUsuario,nombre:e.target.value})}/></label><label>Rol<select value={editarUsuario.rol} onChange={e=>setEditarUsuario({...editarUsuario,rol:e.target.value})}><option>Administrador</option><option>Mesero</option><option>Cocinero</option></select></label></Modal>}
      
      {aviso&&<div className="toast"><span className="toast-check">✓</span>{aviso}</div>}
    </div>
  );
}