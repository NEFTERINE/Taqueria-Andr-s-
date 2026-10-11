import { X } from "lucide-react";

export default function Modal({ titulo, descripcion, cerrar, guardar }) {
  return (
    <div className="modal-backdrop" onClick={cerrar}>
      <form
        className="modal"
        onSubmit={guardar}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h2>{titulo}</h2>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={cerrar}
            aria-label="Cerrar"
          >
            <X size={19} />
          </button>
        </div>

        {/* Nombre completo */}
        <div className="form-group">
          <label>Nombre completo</label>
          <input type="text" name="nombre" placeholder="Nombre completo" />
        </div>

        {/* Nombre de usuario */}
        <div className="form-group">
          <label>Nombre de usuario</label>
          <input type="text" name="usuario" placeholder="Nombre de usuario" />
        </div>

        {/* Contraseña */}
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" name="contrasena" placeholder="Contraseña" />
        </div>

        {/* Rol */}
        <div className="form-group">
          <label>Rol</label>
          <select name="rol">
            <option value="">Selecciona un rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Empleado">Empleado</option>
          </select>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={cerrar}>
            Cancelar
          </button>

          <button type="submit" className="btn-primary">
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
