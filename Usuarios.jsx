import { Plus, Search, Pencil, Power, Users } from "lucide-react";
export default function Usuarios({
  usuarios,
  total,
  buscar,
  setBuscar,
  nombre,
  setNombre,
  nombreUsuario,
  setNombreusuario,
  correo,
  setCorreo,
  rol,
  setRol,
  crearUsuario,
  editar,
  cambiarEstatus,
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">ACCESOS DEL PERSONAL</div>
          <h1>Usuarios y permisos</h1>
          <p>Crea cuentas, asigna roles y controla el acceso del personal.</p>
        </div>
        <span className="pill pill-orange">Solo administrador</span>
      </div>
      <section className="panel">
        <div className="panel-title">
          <div>
            <h2>Registrar usuario</h2>
            <p>Completa los datos para dar acceso al sistema.</p>
          </div>
          <div className="panel-icon">
            <Users size={19} />
          </div>
        </div>
        <form className="form-grid user-form" onSubmit={crearUsuario}>
          <label>
            Nombre completo
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre y apellidos"
            />
          </label>
          <label>
            Nombre de usuario
            <input
              required
              value={nombreUsuario}
              onChange={(e) => setNombreusuario(e.target.value)}
              placeholder="Nombre de usuario"
            />
          </label>
          <label>
            Correo electrónico
            <input
              required
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@taqueriaandres.com"
            />
          </label>
          <label>
            Rol del usuario
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option>Cajera</option>
              <option>Encargado</option>
              <option>Administrador</option>
            </select>
          </label>
          <button className="btn-primary" type="submit">
            <Plus size={17} /> Crear usuario
          </button>
        </form>
      </section>
      <section className="panel table-panel">
        <div className="table-heading">
          <div>
            <h2>Personal registrado</h2>
            <p>{total} cuentas registradas</p>
          </div>
          <div className="search-box">
            <Search size={17} />
            <input
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar usuario..."
            />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>USUARIO</th>
                <th>CORREO</th>
                <th>ROL</th>
                <th>ESTATUS</th>
                <th>PERMISOS</th>
                <th className="right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {u.nombre
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <b>{u.nombre}</b>
                    </div>
                  </td>
                  <td className="muted email-cell">{u.correo}</td>
                  <td>
                    <span className="pill pill-gray">{u.rol}</span>
                  </td>
                  <td>
                    <span
                      className={
                        "pill " +
                        (u.estatus === "Activo" ? "pill-green" : "pill-gray")
                      }
                    >
                      {u.estatus}
                    </span>
                  </td>
                  <td className="muted permissions-cell">{u.permisos}</td>
                  <td>
                    <div className="actions">
                      <button
                        title="Editar usuario"
                        onClick={() => editar({ ...u })}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        title={
                          u.estatus === "Activo" ? "Desactivar" : "Activar"
                        }
                        onClick={() => cambiarEstatus(u)}
                      >
                        <Power size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuarios.length === 0 && (
            <div className="empty">No se encontraron usuarios.</div>
          )}
        </div>
      </section>
    </>
  );
}
