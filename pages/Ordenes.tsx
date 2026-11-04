import { useState } from 'react';
import {
  Utensils,
  Plus,
  Minus,
  Trash2,
  Users,
  ShoppingBag,
  Send,
  Search
} from 'lucide-react';

export default function Ordenes({ productos = [], notificar }) {
  // Datos mock por si no vienen productos del prop
  const listaProductos = productos.length > 0 ? productos : [
    { id: 1, nombre: 'Taco de Asada', precio: 25.00 },
    { id: 2, nombre: 'Taco de Adobada', precio: 22.00 },
    { id: 3, nombre: 'Taco de Tripa', precio: 28.00 },
    { id: 4, nombre: 'Quesadilla con Carne', precio: 45.00 },
    { id: 5, nombre: 'Vampiro de Asada', precio: 35.00 },
    { id: 6, nombre: 'Refresco 600ml', precio: 25.00 },
    { id: 7, nombre: 'Agua Fresca Horchata', precio: 20.00 }
  ];

  // Estados locales de maquetación
  const [mesa, setMesa] = useState('');
  const [tipoCuenta, setTipoCuenta] = useState('junta');
  const [personaActual, setPersonaActual] = useState(1);
  const [tipoEntrega, setTipoEntrega] = useState('comer_aqui');
  const [buscarProducto, setBuscarProducto] = useState('');

  // Carrito simulado en memoria local
  const [carrito, setCarrito] = useState([
    {
      id_producto: 1,
      nombre: 'Taco de Asada',
      precio: 25.00,
      cantidad: 2,
      numPersona: 1,
      tipoEntrega: 'comer_aqui',
      sinVerdura: true,
      especificaciones: 'Salsa verde aparte'
    }
  ]);

  const agregarAlCarrito = (producto) => {
    if (!mesa.trim()) {
      alert('Por favor ingresa un identificador de Mesa o Cliente primero.');
      return;
    }

    const itemExistente = carrito.findIndex(
      (item) =>
        item.id_producto === producto.id &&
        item.numPersona === (tipoCuenta === 'separada' ? personaActual : 1) &&
        item.tipoEntrega === tipoEntrega
    );

    if (itemExistente > -1) {
      const nuevoCarrito = [...carrito];
      nuevoCarrito[itemExistente].cantidad += 1;
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([
        ...carrito,
        {
          id_producto: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
          numPersona: tipoCuenta === 'separada' ? personaActual : 1,
          tipoEntrega: tipoEntrega,
          sinVerdura: false,
          especificaciones: ''
        }
      ]);
    }
  };

  const cambiarCantidad = (index, delta) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad += delta;
    if (nuevoCarrito[index].cantidad <= 0) {
      nuevoCarrito.splice(index, 1);
    }
    setCarrito(nuevoCarrito);
  };

  const actualizarDetalle = (index, campo, valor) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito[index][campo] = valor;
    setCarrito(nuevoCarrito);
  };

  const handleEnviarSimulado = (e) => {
    e.preventDefault();
    if (carrito.length === 0) return;

    if (notificar) {
      notificar(`Orden simulada enviada para: ${mesa}`);
    } else {
      alert(`Orden de prueba enviada para: ${mesa}`);
    }

    setCarrito([]);
    setMesa('');
    setPersonaActual(1);
  };

  const totalComanda = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const productosFiltrados = listaProductos.filter(p =>
    p.nombre.toLowerCase().includes(buscarProducto.toLowerCase())
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">TOMA DE PEDIDOS</div>
          <h1>Levantar Orden / Comanda</h1>
          <p>Selecciona productos del menú, organiza por persona y arma la orden del cliente.</p>
        </div>
        <span className="pill pill-orange">Sprint 2 — Solo UI</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '19px' }}>

        {/* COLUMNA IZQUIERDA: CATÁLOGO DE PRODUCTOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '19px' }}>

          <section className="panel" style={{ padding: '16px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div className="search-box" style={{ width: '100%' }}>
                <Search size={17} />
                <input
                  value={buscarProducto}
                  onChange={(e) => setBuscarProducto(e.target.value)}
                  placeholder="Buscar taco, bebida, orden..."
                />
              </div>
              <div className="panel-icon">
                <Utensils size={19} />
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">
              <div>
                <h2>Menú de Platillos</h2>
                <p>Haz clic en un producto para agregarlo a la comanda</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
              {productosFiltrados.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => agregarAlCarrito(p)}
                  style={{
                    background: '#fff',
                    border: '1px solid #edf0f3',
                    borderRadius: '12px',
                    padding: '14px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '6px',
                    textAlign: 'left',
                    transition: '.15s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>{p.nombre}</span>
                  <span className="price" style={{ fontSize: '13px', fontWeight: '800' }}>${p.precio.toFixed(2)}</span>
                </button>
              ))}

              {productosFiltrados.length === 0 && (
                <div className="empty" style={{ gridColumn: '1 / -1' }}>No se encontraron productos en el menú.</div>
              )}
            </div>
          </section>
        </div>

        {/* COLUMNA DERECHA: COMANDA EN CONSTRUCCIÓN */}
        <section className="panel" style={{ height: 'fit-content' }}>
          <div className="panel-title">
            <div>
              <h2>Comanda Actual</h2>
              <p>Datos del pedido y modificadores</p>
            </div>
            <div className="panel-icon">
              <ShoppingBag size={19} />
            </div>
          </div>

          <form onSubmit={handleEnviarSimulado} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* INPUTS ESTILIZADOS DE MESA Y TIPO CUENTA */}
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', background: '#f8fafc', padding: '12px' }}>
              <label>Mesa / Cliente
                <input
                  required
                  value={mesa}
                  onChange={(e) => setMesa(e.target.value)}
                  placeholder="Ej. Mesa 4 o Juan"
                />
              </label>

              <label>Modalidad de Cuenta
                <select value={tipoCuenta} onChange={(e) => setTipoCuenta(e.target.value)}>
                  <option value="junta">Cuenta Junta</option>
                  <option value="separada">Cuenta Separada</option>
                </select>
              </label>
            </div>

            {/* BARRA DE SELECCIÓN DINÁMICA DE PERSONAS */}
            {tipoCuenta === 'separada' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff7ed', padding: '10px 12px', borderRadius: '10px', border: '1px solid #ffedd5', flexWrap: 'wrap' }}>
                <Users size={16} color="#ea580c" />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#c2410c' }}>
                  Asignando a: <b>Persona #{personaActual}</b>
                </span>

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Muestra dinámicamente las personas que ya tienen productos + la persona actual */}
                  {Array.from(new Set([...carrito.map(i => i.numPersona), personaActual]))
                    .sort((a, b) => a - b)
                    .map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPersonaActual(num)}
                        className={`pill ${personaActual === num ? 'pill-orange' : 'pill-gray'}`}
                        style={{ cursor: 'pointer' }}
                      >
                        P{num}
                      </button>
                    ))}

                  {/* Botón para crear/pasar a la siguiente persona */}
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ height: '26px', padding: '0 8px', fontSize: '10px', borderRadius: '20px' }}
                    onClick={() => {
                      const maxPersona = Math.max(...carrito.map(i => i.numPersona), personaActual, 0);
                      setPersonaActual(maxPersona + 1);
                    }}
                  >
                    + Nueva Persona
                  </button>
                </div>
              </div>
            )}

            {/* BOTONES DE TIPO DE ENTREGA */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setTipoEntrega('comer_aqui')}
                className={`btn-secondary ${tipoEntrega === 'comer_aqui' ? 'btn-primary' : ''}`}
                style={{ flex: 1, fontSize: '11px', height: '36px', justifyContent: 'center' }}
              >
                Comer aquí
              </button>
              <button
                type="button"
                onClick={() => setTipoEntrega('para_llevar')}
                className={`btn-secondary ${tipoEntrega === 'para_llevar' ? 'btn-primary' : ''}`}
                style={{ flex: 1, fontSize: '11px', height: '36px', justifyContent: 'center' }}
              >
                Para llevar
              </button>
            </div>

            {/* LISTADO DE ITEMS CON SUS CHECKBOXES Y INPUTS */}
            <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', margin: '4px 0' }}>
              {carrito.map((item, idx) => (
                <div key={idx} style={{ border: '1px solid #edf0f3', borderRadius: '10px', padding: '10px', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <b style={{ fontSize: '12px', color: '#1e293b' }}>{item.nombre}</b>
                      {tipoCuenta === 'separada' && (
                        <span className="pill pill-orange" style={{ marginLeft: '6px', fontSize: '9px' }}>P{item.numPersona}</span>
                      )}
                      <span className="pill pill-gray" style={{ marginLeft: '4px', fontSize: '9px' }}>
                        {item.tipoEntrega === 'para_llevar' ? 'Llevar' : 'Mesa'}
                      </span>
                    </div>
                    <span className="price" style={{ fontWeight: '700' }}>${(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>

                  {/* Modificadores */}
                  <div className="modal" style={{ padding: 0, width: '100%', boxShadow: 'none', background: 'transparent', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ flexDirection: 'row', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '10px', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={item.sinVerdura}
                        onChange={(e) => actualizarDetalle(idx, 'sinVerdura', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      Sin verdura
                    </label>

                    <input
                      value={item.especificaciones}
                      onChange={(e) => actualizarDetalle(idx, 'especificaciones', e.target.value)}
                      placeholder="Notas (ej. salsa verde aparte)"
                      style={{ height: '32px', fontSize: '10px', flex: 1 }}
                    />
                  </div>

                  {/* Control de cantidad (+ / -) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" className="icon-button" style={{ height: '26px', width: '26px' }} onClick={() => cambiarCantidad(idx, -1)}>
                      <Minus size={13} />
                    </button>
                    <b style={{ fontSize: '12px' }}>{item.cantidad}</b>
                    <button type="button" className="icon-button" style={{ height: '26px', width: '26px' }} onClick={() => cambiarCantidad(idx, 1)}>
                      <Plus size={13} />
                    </button>
                    <button type="button" className="icon-button" style={{ height: '26px', width: '26px', color: '#dc2626' }} onClick={() => cambiarCantidad(idx, -item.cantidad)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}

              {carrito.length === 0 && (
                <div className="empty">La comanda está vacía. Selecciona platillos del menú para armar el pedido.</div>
              )}
            </div>

            {/* TOTAL */}
            <div style={{ background: '#f8fafc', border: '1px solid #edf0f3', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Total Comanda:</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#ea580c' }}>${totalComanda.toFixed(2)}</span>
            </div>

            <button className="btn-primary" type="submit" disabled={carrito.length === 0} style={{ width: '100%', height: '42px', justifyContent: 'center' }}>
              <Send size={16} /> Enviar Orden (Simulado)
            </button>
          </form>
        </section>

      </div>
    </>
  );
}