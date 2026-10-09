import { useMemo, useState } from 'react';
import { Boxes, Users, ShoppingCart, ClipboardList, BarChart3, Settings, LayoutDashboard, CircleDollarSign, X, Pencil, Power, Utensils, Plus, Search } from 'lucide-react';
import Login from './pages/Login.jsx';
import Inventario from './pages/Inventario.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Modal from './components/ui/Modal.jsx';

const productosIniciales = [
 {id:1,nombre:'Taco al pastor',descripcion:'Tortilla, carne al pastor, cebolla y cilantro',precio:18,estatus:'Activo',ventas:124},
 {id:2,nombre:'Taco de asada',descripcion:'Tortilla, carne asada, cebolla y cilantro',precio:22,estatus:'Activo',ventas:98},
 {id:3,nombre:'Gringa',descripcion:'Carne al pastor, queso y tortilla de harina',precio:55,estatus:'Activo',ventas:42},
 {id:4,nombre:'Agua fresca',descripcion:'Bebida fresca del día',precio:25,estatus:'Activo',ventas:76},
];
const usuariosIniciales = [
 {id:1,nombre:'Mariana López',correo:'mariana@taqueriaandres.com',rol:'Cajera',estatus:'Activo',permisos:'Ventas, gastos'},
 {id:2,nombre:'Carlos Méndez',correo:'carlos@taqueriaandres.com',rol:'Encargado',estatus:'Activo',permisos:'Ventas, inventario, reportes'},
 {id:3,nombre:'Laura Sánchez',correo:'laura@taqueriaandres.com',rol:'Cajera',estatus:'Inactivo',permisos:'Ventas'},
];
const nav = [
 {id:'inicio',label:'Resumen',icon:LayoutDashboard}, {id:'inventario',label:'Inventario',icon:Boxes},
 {id:'usuarios',label:'Usuarios',icon:Users}, {id:'ventas',label:'Ventas',icon:ShoppingCart},
 {id:'ordenes',label:'Órdenes',icon:ClipboardList}, {id:'reportes',label:'Reportes',icon:BarChart3},
 {id:'configuracion',label:'Configuración',icon:Settings}
];
const titulos = {inicio:'Resumen general',inventario:'Inventario de productos',usuarios:'Usuarios y permisos',ventas:'Ventas',ordenes:'Órdenes',reportes:'Reportes',configuracion:'Configuración'};
const permisosPorRol = rol => rol === 'Cajera' ? 'Ventas, gastos' : rol === 'Encargado' ? 'Ventas, inventario, reportes' : 'Acceso completo';

export default function App(){
 const [sesion,setSesion] = useState(false);
 const [pagina,setPagina] = useState('inicio');
 const [menuAbierto,setMenuAbierto] = useState(false);
 const [productos,setProductos] = useState(productosIniciales);
 const [usuarios,setUsuarios] = useState(usuariosIniciales);
 const [buscar,setBuscar] = useState('');
 const [nombre,setNombre] = useState(''); const [precio,setPrecio] = useState(''); const [descripcion,setDescripcion] = useState('');
 const [nombreUsuario,setNombreUsuario] = useState(''); const [correo,setCorreo] = useState(''); const [rol,setRol] = useState('Cajera');
 const [editarProducto,setEditarProducto] = useState(null); const [editarUsuario,setEditarUsuario] = useState(null); const [aviso,setAviso] = useState('');
 const activos = productos.filter(p=>p.estatus==='Activo').length;
 const productosFiltrados = useMemo(()=>productos.filter(p=>(p.nombre+' '+p.descripcion).toLowerCase().includes(buscar.toLowerCase())),[productos,buscar]);
 const usuariosFiltrados = useMemo(()=>usuarios.filter(u=>(u.nombre+' '+u.correo+' '+u.rol).toLowerCase().includes(buscar.toLowerCase())),[usuarios,buscar]);
 function notificar(msg){setAviso(msg);setTimeout(()=>setAviso(''),2800)}
 function agregarProducto(e){e.preventDefault();if(!nombre.trim()||!precio||Number(precio)<=0)return;setProductos([...productos,{id:Date.now(),nombre:nombre.trim(),precio:Number(precio),descripcion:descripcion.trim()||'Sin descripción',estatus:'Activo',ventas:0}]);setNombre('');setPrecio('');setDescripcion('');notificar('Producto agregado al inventario')}
 function guardarProducto(e){e.preventDefault();setProductos(productos.map(p=>p.id===editarProducto.id?{...p,...editarProducto,precio:Number(editarProducto.precio)}:p));setEditarProducto(null);notificar('Producto actualizado')}
 function crearUsuario(e){e.preventDefault();if(!nombreUsuario.trim()||!correo.trim())return;setUsuarios([...usuarios,{id:Date.now(),nombre:nombreUsuario.trim(),correo:correo.trim(),rol,estatus:'Activo',permisos:permisosPorRol(rol)}]);setNombreUsuario('');setCorreo('');setRol('Cajera');notificar('Usuario creado correctamente')}
 function guardarUsuario(e){e.preventDefault();setUsuarios(usuarios.map(u=>u.id===editarUsuario.id?{...editarUsuario,permisos:permisosPorRol(editarUsuario.rol)}:u));setEditarUsuario(null);notificar('Usuario actualizado')}
 if(!sesion) return <Login onLogin={()=>setSesion(true)} />;
 return <div className="app-shell">
  <Sidebar nav={nav} pagina={pagina} setPagina={id=>{setPagina(id);setBuscar('')}} menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto} onLogout={()=>setSesion(false)} />
  <main className="main-area"><Header titulo={titulos[pagina]} setMenuAbierto={setMenuAbierto}/><div className="content">
   {pagina==='inventario'&&<Inventario productos={productosFiltrados} total={productos.length} activos={activos} buscar={buscar} setBuscar={setBuscar} nombre={nombre} setNombre={setNombre} precio={precio} setPrecio={setPrecio} descripcion={descripcion} setDescripcion={setDescripcion} agregarProducto={agregarProducto} editar={setEditarProducto} cambiarEstatus={p=>{setProductos(productos.map(x=>x.id===p.id?{...x,estatus:x.estatus==='Activo'?'Inactivo':'Activo'}:x));notificar('Estatus del producto actualizado')}}/>}
   {pagina==='usuarios'&&<Usuarios usuarios={usuariosFiltrados} total={usuarios.length} buscar={buscar} setBuscar={setBuscar} nombre={nombreUsuario} setNombre={setNombreUsuario} correo={correo} setCorreo={setCorreo} rol={rol} setRol={setRol} crearUsuario={crearUsuario} editar={setEditarUsuario} cambiarEstatus={u=>{setUsuarios(usuarios.map(x=>x.id===u.id?{...x,estatus:x.estatus==='Activo'?'Inactivo':'Activo'}:x));notificar('Estatus del usuario actualizado')}}/>}
   {pagina!=='inventario'&&pagina!=='usuarios'&&<><div className="page-heading"><div><div className="eyebrow">TAQUERÍA ANDRÉS</div><h1>{titulos[pagina]}</h1><p>Administra la información de tu negocio desde este panel.</p></div></div>{pagina==='inicio'?<div className="stats-grid"><div className="stat-card"><span>Ventas de hoy</span><CircleDollarSign/><strong>$3,850.00</strong><small>Resumen de demostración</small></div><div className="stat-card"><span>Productos activos</span><Boxes/><strong>{activos}</strong><small>Disponibles para venta</small></div><div className="stat-card"><span>Usuarios registrados</span><Users/><strong>{usuarios.length}</strong><small>Cuentas del personal</small></div></div>:<section className="panel placeholder"><div className="panel-icon"><Settings size={22}/></div><h2>Módulo de {titulos[pagina].toLowerCase()}</h2><p>La navegación está lista. Este módulo puede desarrollarse por separado.</p><button className="btn-secondary" onClick={()=>setPagina('inventario')}>Ir al inventario</button></section>}</>}
   <Footer />
  </div></main>
  {editarProducto&&<Modal titulo="Editar producto" descripcion="Actualiza la información del producto." cerrar={()=>setEditarProducto(null)} guardar={guardarProducto}><label>Nombre<input required value={editarProducto.nombre} onChange={e=>setEditarProducto({...editarProducto,nombre:e.target.value})}/></label><label>Descripción<input value={editarProducto.descripcion} onChange={e=>setEditarProducto({...editarProducto,descripcion:e.target.value})}/></label><label>Precio<input required type="number" min="0.01" step="0.01" value={editarProducto.precio} onChange={e=>setEditarProducto({...editarProducto,precio:e.target.value})}/></label></Modal>}
  {editarUsuario&&<Modal titulo="Editar usuario" descripcion="Modifica los datos y el rol de acceso." cerrar={()=>setEditarUsuario(null)} guardar={guardarUsuario}><label>Nombre completo<input required value={editarUsuario.nombre} onChange={e=>setEditarUsuario({...editarUsuario,nombre:e.target.value})}/></label><label>Correo electrónico<input required type="email" value={editarUsuario.correo} onChange={e=>setEditarUsuario({...editarUsuario,correo:e.target.value})}/></label><label>Rol<select value={editarUsuario.rol} onChange={e=>setEditarUsuario({...editarUsuario,rol:e.target.value})}><option>Cajera</option><option>Encargado</option><option>Administrador</option></select></label></Modal>}
  {aviso&&<div className="toast"><span className="toast-check">✓</span>{aviso}</div>}
 </div>
}
