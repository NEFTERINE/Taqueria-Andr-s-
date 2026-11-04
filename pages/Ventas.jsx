import { useState } from "react";
import {
  DollarSign,
  Receipt,
  User,
  Users,
  Clock,
} from "lucide-react";

export default function Ventas({ ordenes = [], notificar }) {
  // Estado local con órdenes de ejemplo para maquetación pura
  const listaOrdenesMock =
    ordenes.length > 0
      ? ordenes
      : [
          {
            id: 101,
            mesa: "Mesa 4",
            estatus: "Abierta",
            hora: "19:40",
            total: 195.0,
            pedidos: [
              {
                persona: 1,
                tipoEntrega: "comer_aqui",
                pagado: false,
                items: [
                  {
                    cantidad: 2,
                    nombre: "Taco de Asada",
                    precio: 25.0,
                    detalles: "Con todo",
                  },
                  {
                    cantidad: 1,
                    nombre: "Refresco 600ml",
                    precio: 25.0,
                    detalles: "",
                  },
                ],
              },
              {
                persona: 2,
                tipoEntrega: "para_llevar",
                pagado: false,
                items: [
                  {
                    cantidad: 3,
                    nombre: "Taco de Adobada",
                    precio: 22.0,
                    detalles: "Sin verdura",
                  },
                  {
                    cantidad: 1,
                    nombre: "Vampiro de Asada",
                    precio: 35.0,
                    detalles: "Bien dorado",
                  },
                ],
              },
            ],
          },
          
          {
            id: 102,
            mesa: "Mesa 2 (Juan)",
            estatus: "Abierta",
            hora: "20:05",
            total: 90.0,
            pedidos: [
              {
                persona: 1,
                tipoEntrega: "comer_aqui",
                pagado: false,
                items: [
                  {
                    cantidad: 2,
                    nombre: "Quesadilla con Carne",
                    precio: 45.0,
                    detalles: "",
                  },
                ],
              },
            ],
          },
        ];

  const [ordenesActivas, setOrdenesActivas] = useState(listaOrdenesMock);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(
    listaOrdenesMock[0] || null,
  );

  // Modos de cobro: 'total' o 'persona'
  const [modoCobro, setModoCobro] = useState("total");
  const [personaACobrar, setPersonaACobrar] = useState(1);
  const [metodoPago, setMetodoPago] = useState("efectivo");

  // Procesar cobro simulado en interfaz
  const handleCobrar = (e) => {
    e.preventDefault();
    if (!ordenSeleccionada) return;

    if (modoCobro === "total") {
      // Marcar toda la orden como cobrada y cerrarla
      const actualizadas = ordenesActivas.filter(
        (o) => o.id !== ordenSeleccionada.id,
      );
      setOrdenesActivas(actualizadas);
      if (notificar)
        notificar(
          `Orden #${ordenSeleccionada.id} cobrada en su totalidad ($${ordenSeleccionada.total.toFixed(2)})`,
        );
      setOrdenSeleccionada(actualizadas[0] || null);
    } else {
      // Cobrar solo la persona seleccionada
      const ordenActualizada = { ...ordenSeleccionada };
      const pedidoPersona = ordenActualizada.pedidos.find(
        (p) => p.persona === personaACobrar,
      );
      if (pedidoPersona) pedidoPersona.pagado = true;

      // Verificar si ya pagaron todas las personas
      const todasPagadas = ordenActualizada.pedidos.every((p) => p.pagado);
      if (todasPagadas) {
        const actualizadas = ordenesActivas.filter(
          (o) => o.id !== ordenSeleccionada.id,
        );
        setOrdenesActivas(actualizadas);
        setOrdenSeleccionada(actualizadas[0] || null);
        if (notificar) notificar(`Mesa completamente liquidada y cerrada.`);
      } else {
        setOrdenSeleccionada(ordenActualizada);
        // Seleccionar automáticamente la siguiente persona pendiente si existe
        const siguientePendiente = ordenActualizada.pedidos.find(p => !p.pagado);
        if (siguientePendiente) setPersonaACobrar(siguientePendiente.persona);

        if (notificar)
          notificar(
            `Pago individual de Persona #${personaACobrar} registrado.`,
          );
      }
    }
  };

  // Cálculos de montos
  const totalOrden = ordenSeleccionada ? ordenSeleccionada.total : 0;

  const pedidoPersonaSeleccionada = ordenSeleccionada?.pedidos.find(
    (p) => p.persona === personaACobrar,
  );
  
  const totalPersonaSeleccionada = pedidoPersonaSeleccionada && !pedidoPersonaSeleccionada.pagado
    ? pedidoPersonaSeleccionada.items.reduce(
        (a, c) => a + c.precio * c.cantidad,
        0,
      )
    : 0;

  const montoACobrar =
    modoCobro === "total" ? totalOrden : totalPersonaSeleccionada;

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">PUNTO DE VENTA</div>
          <h1>Módulo de Cobro y Ventas</h1>
          <p>
            Liquida cuentas completas o por separado para cerrar los pedidos de las mesas.
          </p>
        </div>
        <span className="pill pill-orange">Caja y Cobros</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "19px",
        }}
      >
        {/* COLUMNA IZQUIERDA: MESA / CUENTAS PENDIENTES DE COBRO */}
        <section className="panel" style={{ height: "fit-content" }}>
          <div className="panel-title" style={{ marginBottom: "14px" }}>
            <div>
              <h2>Cuentas Activas</h2>
              <p>{ordenesActivas.length} mesas por cobrar</p>
            </div>
            <div className="panel-icon">
              <Clock size={19} />
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {ordenesActivas.map((ord) => (
              <div
                key={ord.id}
                onClick={() => {
                  setOrdenSeleccionada(ord);
                  const primerPendiente = ord.pedidos.find(p => !p.pagado);
                  if (primerPendiente) setPersonaACobrar(primerPendiente.persona);
                }}
                style={{
                  padding: "12px 14px",
                  borderRadius: "11px",
                  border:
                    ordenSeleccionada?.id === ord.id
                      ? "2px solid #ea580c"
                      : "1px solid #edf0f3",
                  background:
                    ordenSeleccionada?.id === ord.id ? "#fff7ed" : "#fff",
                  cursor: "pointer",
                  transition: ".15s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <b style={{ fontSize: "13px", color: "#1e293b" }}>
                    {ord.mesa}
                  </b>
                  <span
                    className="price"
                    style={{ fontSize: "13px", fontWeight: "800" }}
                  >
                    ${ord.total.toFixed(2)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "6px",
                    fontSize: "10px",
                    color: "#8b95a3",
                  }}
                >
                  <span>Folio: #{ord.id}</span>
                  <span>{ord.pedidos.length} consumo(s)</span>
                </div>
              </div>
            ))}

            {ordenesActivas.length === 0 && (
              <div className="empty">
                No hay cuentas abiertas pendientes de cobro.
              </div>
            )}
          </div>
        </section>

        {/* COLUMNA DERECHA: DESGLOSE Y PANEL DE PAGO */}
        {ordenSeleccionada ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "19px" }}
          >
            {/* PANEL DE DETALLE DE CONSUMOS EN LA MESA */}
            <section className="panel table-panel">
              <div className="table-heading">
                <div>
                  <h2>Comanda de {ordenSeleccionada.mesa}</h2>
                  <p>Revisa la comanda antes de realizar el cobro.</p>
                </div>
                <span className="pill pill-green">
                  Orden #{ordenSeleccionada.id}
                </span>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>PERSONA</th>
                      <th>ENTREGA</th>
                      <th>PLATILLOS / CONSUMO</th>
                      <th>ESTATUS PAGO</th>
                      <th className="right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenSeleccionada.pedidos.map((ped, idx) => {
                      const totalPed = ped.items.reduce(
                        (a, c) => a + c.precio * c.cantidad,
                        0,
                      );
                      return (
                        <tr
                          key={idx}
                          style={{
                            background: ped.pagado ? "#f8fafc" : "transparent",
                          }}
                        >
                          <td>
                            <b>Persona #{ped.persona}</b>
                          </td>
                          <td>
                            <span
                              className={`pill ${ped.tipoEntrega === "para_llevar" ? "pill-orange" : "pill-gray"}`}
                            >
                              {ped.tipoEntrega === "para_llevar"
                                ? "Para llevar"
                                : "Comer aquí"}
                            </span>
                          </td>
                          <td>
                            {ped.items.map((it, i) => (
                              <div
                                key={i}
                                style={{
                                  fontSize: "11px",
                                  color: ped.pagado ? "#94a3b8" : "#334155",
                                }}
                              >
                                {it.cantidad}x {it.nombre}
                                {it.detalles && (
                                  <i className="muted"> ({it.detalles})</i>
                                )}
                              </div>
                            ))}
                          </td>
                          <td>
                            <span
                              className={`pill ${ped.pagado ? "pill-green" : "pill-orange"}`}
                            >
                              {ped.pagado ? "Pagado" : "Pendiente"}
                            </span>
                          </td>
                          <td
                            className="right price"
                            style={{
                              textDecoration: ped.pagado
                                ? "line-through"
                                : "none",
                              color: ped.pagado ? "#94a3b8" : "#ea580c",
                            }}
                          >
                            ${totalPed.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECCIÓN PROCESAR COBRO */}
            <section className="panel">
              <div className="panel-title">
                <div>
                  <h2>Procesar Cobro</h2>
                  <p>Selecciona si pagan juntos o individualmente.</p>
                </div>
                <div className="panel-icon">
                  <DollarSign size={19} />
                </div>
              </div>

              <form
                onSubmit={handleCobrar}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* SELECTOR DE MODALIDAD DE PAGO */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setModoCobro("total")}
                    className={`btn-secondary ${modoCobro === "total" ? "btn-primary" : ""}`}
                    style={{
                      height: "42px",
                      justifyContent: "center",
                      fontSize: "11px",
                    }}
                  >
                    <Users size={16} /> Cobrar Cuenta Completa
                  </button>

                  <button
                    type="button"
                    onClick={() => setModoCobro("persona")}
                    className={`btn-secondary ${modoCobro === "persona" ? "btn-primary" : ""}`}
                    style={{
                      height: "42px",
                      justifyContent: "center",
                      fontSize: "11px",
                    }}
                  >
                    <User size={16} /> Cobrar por Separado (Por Persona)
                  </button>
                </div>

                {/* SELECCIÓN DINÁMICA DE PERSONA A COBRAR */}
                {modoCobro === "persona" && (
                  <div
                    style={{
                      background: "#fff7ed",
                      border: "1px solid #ffedd5",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#c2410c",
                        }}
                      >
                        Selecciona la persona que va a pagar:
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#9a3412",
                          fontWeight: 700,
                        }}
                      >
                        Seleccionada: Persona #{personaACobrar}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        overflowX: "auto",
                        paddingBottom: "4px",
                        scrollbarWidth: "thin",
                      }}
                    >
                      {(ordenSeleccionada?.pedidos || []).map((p) => {
                        const esSeleccionada = personaACobrar === p.persona;
                        return (
                          <button
                            key={p.persona}
                            type="button"
                            disabled={p.pagado}
                            onClick={() => setPersonaACobrar(p.persona)}
                            className={`pill ${esSeleccionada ? "pill-orange" : "pill-gray"}`}
                            style={{
                              padding: "6px 12px",
                              fontSize: "11px",
                              fontWeight: "600",
                              cursor: p.pagado ? "not-allowed" : "pointer",
                              opacity: p.pagado ? 0.45 : 1,
                              whiteSpace: "nowrap",
                              border: esSeleccionada
                                ? "1px solid #ea580c"
                                : "1px solid #e2e8f0",
                              textDecoration: p.pagado
                                ? "line-through"
                                : "none",
                            }}
                          >
                            Persona #{p.persona} {p.pagado ? "(Pagado)" : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* FORMA DE PAGO */}
                <div
                  className="modal"
                  style={{
                    padding: 0,
                    width: "100%",
                    boxShadow: "none",
                    background: "transparent",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <label>
                    Método de Pago
                    <select
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta (Terminal)</option>
                      <option value="transferencia">Transferencia</option>
                    </select>
                  </label>

                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #edf0f3",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#98a1ae",
                        fontWeight: 700,
                      }}
                    >
                      MONTO TOTAL A COBRAR
                    </span>
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "#ea580c",
                      }}
                    >
                      ${montoACobrar.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  type="submit"
                  disabled={montoACobrar === 0}
                  style={{
                    width: "100%",
                    height: "44px",
                    justifyContent: "center",
                    background: "#16a34a",
                  }}
                >
                  <Receipt size={17} /> Finalizar Cobro ($
                  {montoACobrar.toFixed(2)})
                </button>
              </form>
            </section>
          </div>
        ) : (
          <section className="panel placeholder">
            <h2>Ninguna orden seleccionada</h2>
            <p>
              Selecciona una mesa de la lista izquierda para proceder con su
              cobro.
            </p>
          </section>
        )}
      </div>
    </>
  );
}