import { Plus, Search, Pencil, Power, Utensils } from "lucide-react";
export default function Inventario({
  productos,
  total,
  activos,
  buscar,
  setBuscar,
  nombre,
  setNombre,
  precio,
  setPrecio,
  descripcion,
  setDescripcion,
  agregarProducto,
  editar,
  cambiarEstatus,
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">CONTROL DEL NEGOCIO</div>
          <h1>Inventario de productos</h1>
          <p>
            Administra los productos, precios y disponibilidad de tu taquería.
          </p>
        </div>
        <span className="pill pill-green">
          <span className="dot" />
          {activos} productos activos
        </span>
      </div>
      <section className="panel">
        <div className="panel-title">
          <div>
            <h2>Registrar producto</h2>
            <p>Agrega un nuevo producto al catálogo de ventas.</p>
          </div>
          <div className="panel-icon">
            <Plus size={19} />
          </div>
        </div>
        <form className="form-grid inventory-form" onSubmit={agregarProducto}>
          <label>
            Nombre del producto
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Taco de birria"
            />
          </label>

          <label>
            Precio de venta
            <input
              required
              min="0.01"
              step="0.01"
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="$ 0.00"
            />
          </label>
          <button className="btn-primary" type="submit">
            <Plus size={17} /> Agregar producto
          </button>
        </form>
      </section>
      <section className="panel table-panel">
        <div className="table-heading">
          <div>
            <h2>Productos registrados</h2>
            <p>{total} productos en el catálogo</p>
          </div>
          <div className="search-box">
            <Search size={17} />
            <input
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar producto..."
            />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PRODUCTO</th>
                <th>DESCRIPCIÓN</th>
                <th>PRECIO</th>
                <th>ESTATUS</th>
                <th>VENTAS VINCULADAS</th>
                <th className="right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-icon">
                        <Utensils size={17} />
                      </div>
                      <b>{p.nombre}</b>
                    </div>
                  </td>
                  <td className="muted description-cell">{p.descripcion}</td>
                  <td>
                    <b className="price">${Number(p.precio).toFixed(2)}</b>
                  </td>
                  <td>
                    <span
                      className={
                        "pill " +
                        (p.estatus === "Activo" ? "pill-green" : "pill-gray")
                      }
                    >
                      {p.estatus}
                    </span>
                  </td>
                  <td className="muted">{p.ventas} ventas</td>
                  <td>
                    <div className="actions">
                      <button
                        title="Editar producto"
                        onClick={() => editar({ ...p })}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        title={
                          p.estatus === "Activo" ? "Desactivar" : "Activar"
                        }
                        onClick={() => cambiarEstatus(p)}
                      >
                        <Power size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productos.length === 0 && (
            <div className="empty">No se encontraron productos.</div>
          )}
        </div>
      </section>
    </>
  );
}
