import { X, ChevronRight, LogOut } from 'lucide-react';

export default function Sidebar({nav, pagina, setPagina, menuAbierto, setMenuAbierto, onLogout, usuario}) {
 return (
  <>
   {menuAbierto && <button className="mobile-shade" onClick={() => setMenuAbierto(false)} aria-label="Cerrar menú" />}
   <aside className={'sidebar ' + (menuAbierto ? 'sidebar-open' : '')}>
    <div className="brand">
      <div className="brand-mark">TA</div>
      <span>Taquería Andrés</span>
      <button className="close-menu" onClick={() => setMenuAbierto(false)} aria-label="Cerrar menú"><X size={18} /></button>
    </div>
    <div className="nav-caption">MENÚ PRINCIPAL</div>
    <nav>
      {nav.map(n => {
        const Icon = n.icon;
        return (
          <button key={n.id} className={'nav-item ' + (pagina === n.id ? 'active' : '')} onClick={() => { setPagina(n.id); setMenuAbierto(false); }}>
            <Icon size={18} />
            <span>{n.label}</span>
            {pagina === n.id && <ChevronRight className="nav-arrow" size={15} />}
          </button>
        )
      })}
    </nav>
    <div className="sidebar-bottom">
      <div className="profile">
        <div className="avatar">
          {/* Mostramos la inicial del nombre real */}
          {usuario?.nombre?.charAt(0) || 'U'}
        </div>
        <div>
          {/* Mostramos el nombre real y el rol real provenientes de la Base de Datos */}
          <b>{usuario?.nombre || 'Usuario'}</b>
          <small>{usuario?.rol || 'Rol'}</small>
        </div>
      </div>
      <button className="logout" onClick={onLogout}>
        <LogOut size={17} /> Cerrar sesión
      </button>
    </div>
   </aside>
  </>
 );
}