import { useMemo, useState, useEffect } from "react";
import {
  Boxes,
  Users,
  ShoppingCart,
  ClipboardList,
  BarChart3,
  Settings,
  LayoutDashboard,
  CircleDollarSign,
  Wallet,
} from "lucide-react";
import Login from "./pages/Login.jsx";
import Inventario from "./pages/Inventario.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import Ventas from "./pages/Ventas.jsx";
import CorteCaja from "./pages/CorteCaja.jsx";
import Ordenes from "./pages/Ordenes.js";
import Sidebar from "./components/layout/Sidebar.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import ModalUsuario from "./components/ui/Modal_usuario.jsx";
import ModalInventario from "./components/ui/Modal_inventario.jsx";

const nav = [
  { id: "inicio", label: "Resumen", icon: LayoutDashboard },
  { id: "inventario", label: "Inventario", icon: Boxes },
  { id: "usuarios", label: "Usuarios", icon: Users },
  { id: "ventas", label: "Ventas / Comandas", icon: ShoppingCart },
  { id: "caja", label: "Corte de Caja", icon: Wallet },
  { id: "ordenes", label: "Órdenes", icon: ClipboardList },
  { id: "reportes", label: "Reportes", icon: BarChart3 },
  { id: "configuracion", label: "Configuración", icon: Settings },
];

const titulos = {
  inicio: "Resumen general",
  inventario: "Inventario de productos",
  usuarios: "Usuarios y permisos",
  ventas: "Gestión de ventas y comandas",
  caja: "Control y corte de caja",
  ordenes: "Órdenes registradas",
  reportes: "Reportes de ventas",
  configuracion: "Configuración del sistema",
};

export default function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");
    if (token && usuarioGuardado) {
      setUsuarioActual(JSON.parse(usuarioGuardado));
    }
    setCargandoSesion(false);
  }, []);

  const [pagina, setPagina] = useState("inicio");
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [ordenActiva, setOrdenActiva] = useState(null);
  const [cajaActiva, setCajaActiva] = useState({
    id_corte: 1,
    montoInicial: 500,
    ventas: 0,
    gastosTotales: 0,
    gastos: [],
    estado: "abierta",
  });

  const [buscar, setBuscar] = useState("");
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("Administrador");
  const [editarProducto, setEditarProducto] = useState(null);
  const [editarUsuario, setEditarUsuario] = useState(null);
  const [aviso, setAviso] = useState("");

  const activos = productos.filter((p) => p.estatus === "Activo").length;

  const productosFiltrados = useMemo(
    () =>
      productos.filter((p) =>
        (p.nombre + " " + p.descripcion)
          .toLowerCase()
          .includes(buscar.toLowerCase()),
      ),
    [productos, buscar],
  );

  const usuariosFiltrados = useMemo(
    () =>
      usuarios.filter((u) =>
        (u.nombre + " " + u.rol).toLowerCase().includes(buscar.toLowerCase()),
      ),
    [usuarios, buscar],
  );

  function notificar(msg) {
    setAviso(msg);
    setTimeout(() => setAviso(""), 2800);
  }

  function manejarLogin(datosUsuario) {
    localStorage.setItem("usuario", JSON.stringify(datosUsuario));
    setUsuarioActual(datosUsuario);
  }

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuarioActual(null);
  }

  // --- Módulos BD ---
  const cargarUsuariosBD = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/usuarios", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsuarios(
          data.map((u) => ({
            id: u.id_usuario,
            nombre: u.nombre_completo,
            nombreUsuario: u.nombre_usuario,
            rol: u.rol,
            estatus: u.estatus,
          })),
        );
      }
    } catch (error) {
      notificar("Error de red al cargar usuarios");
    }
  };

  const cargarInventarioBD = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/inventario", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setProductos(
          data.map((p) => ({
            id: p.id_producto,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            estatus: p.estatus,
            ventas: p.ventas,
          })),
        );
      }
    } catch (error) {
      notificar("Error de red al cargar inventario");
    }
  };

  useEffect(() => {
    if (
      usuarioActual &&
      pagina === "usuarios" &&
      usuarioActual.rol === "Administrador"
    ) {
      cargarUsuariosBD();
    }
    if (usuarioActual && (pagina === "inventario" || pagina === "ventas")) {
      cargarInventarioBD();
    }
  }, [pagina, usuarioActual]);

  // --- Handlers de Caja ---
  function abrirCaja(montoInicial) {
    setCajaActiva({
      id_corte: Date.now(),
      montoInicial,
      ventas: 0,
      gastosTotales: 0,
      gastos: [],
      estado: "abierta",
    });
    notificar("Caja abierta correctamente");
  }

  function registrarGasto(gasto) {
    setCajaActiva((prev) => ({
      ...prev,
      gastosTotales: prev.gastosTotales + gasto.monto,
      gastos: [gasto, ...prev.gastos],
    }));
    notificar("Gasto operativo registrado");
  }

  function realizarCorte({ efectivoReal, tipoCorte }) {
    const esperado =
      cajaActiva.montoInicial + cajaActiva.ventas - cajaActiva.gastosTotales;
    const diff = efectivoReal - esperado;

    if (tipoCorte === "cierre") {
      setCajaActiva({ ...cajaActiva, estado: "cerrada" });
      notificar(
        `Cierre finalizado. ${diff === 0 ? "Sin diferencia" : "Diferencia: $" + diff.toFixed(2)}`,
      );
    } else {
      notificar(`Corte parcial registrado. Diferencia: $${diff.toFixed(2)}`);
    }
  }

  if (cargandoSesion) return null;
  if (!usuarioActual) return <Login onLogin={manejarLogin} />;

  return (
    <div className="app-shell">
      <Sidebar
        nav={nav}
        pagina={pagina}
        setPagina={(id) => {
          setPagina(id);
          setBuscar("");
        }}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
        onLogout={cerrarSesion}
        usuario={usuarioActual}
      />

      <main className="main-area">
        <Header
          titulo={titulos[pagina]}
          setMenuAbierto={setMenuAbierto}
          usuario={usuarioActual}
        />

        <div className="content">
          {pagina === "inventario" && (
            <Inventario
              productos={productosFiltrados}
              total={productos.length}
              activos={activos}
              buscar={buscar}
              setBuscar={setBuscar}
              nombre={nombre}
              setNombre={setNombre}
              precio={precio}
              setPrecio={setPrecio}
              descripcion={descripcion}
              setDescripcion={setDescripcion}
              agregarProducto={async (e) => {
                e.preventDefault();
                // Lógica de agregar producto...
              }}
              editar={setEditarProducto}
              cambiarEstatus={async (p) => {
                // Lógica cambiar estatus...
              }}
            />
          )}

          {pagina === "usuarios" && (
            <Usuarios
              usuarios={usuariosFiltrados}
              total={usuarios.length}
              buscar={buscar}
              setBuscar={setBuscar}
              nombre={nombre}
              setNombre={setNombre}
              nombreUsuario={nombreUsuario}
              setNombreUsuario={setNombreUsuario}
              contrasena={contrasena}
              setContrasena={setContrasena}
              rol={rol}
              setRol={setRol}
              crearUsuario={async (e) => {
                e.preventDefault();
                // Lógica crear usuario...
              }}
              editar={setEditarUsuario}
              cambiarEstatus={async (u) => {
                // Lógica estatus usuario...
              }}
            />
          )}

          {pagina === "ventas" && (
            <Ventas
              ordenes={ordenes}
              ordenActiva={ordenActiva}
              setOrdenActiva={setOrdenActiva}
              productos={productos}
              agregarPedidoAOrden={(idOrden, pedido) => {
                setOrdenes((prev) =>
                  prev.map((o) =>
                    o.id === idOrden
                      ? {
                          ...o,
                          pedidos: [...o.pedidos, pedido],
                          total:
                            o.total +
                            pedido.items.reduce(
                              (a, c) => a + c.precio * c.cantidad,
                              0,
                            ),
                        }
                      : o,
                  ),
                );
                notificar("Pedido añadido a la orden");
              }}
              cerrarYCobrarOrden={(idOrden) => {
                const ord = ordenes.find((o) => o.id === idOrden);
                setCajaActiva((prev) => ({
                  ...prev,
                  ventas: prev.ventas + ord.total,
                }));
                setOrdenes((prev) => prev.filter((o) => o.id !== idOrden));
                setOrdenActiva(null);
                notificar(
                  `Orden cobrada exitosamente ($${ord.total.toFixed(2)})`,
                );
              }}
            />
          )}

          {pagina === "caja" && (
            <CorteCaja
              cajaActiva={cajaActiva}
              abrirCaja={abrirCaja}
              registrarGasto={registrarGasto}
              realizarCorte={realizarCorte}
            />
          )}

          {pagina === "ordenes" && (
            <Ordenes
              ordenes={ordenes}
              verDetalleOrden={(ord) => console.log(ord)}
              cambiarEstatusOrden={(idOrden, nuevoEstado) => {
                setOrdenes((prev) =>
                  prev.map((o) =>
                    o.id === idOrden ? { ...o, estado: nuevoEstado } : o,
                  ),
                );
                notificar(`Orden #${idOrden} actualizada a ${nuevoEstado}`);
              }}
            />
          )}

          {pagina !== "inventario" &&
            pagina !== "usuarios" &&
            pagina !== "ventas" &&
            pagina !== "caja" &&
            pagina !== "ordenes" && (
              <>
                <div className="page-heading">
                  <div>
                    <div className="eyebrow">TAQUERÍA ANDRÉS</div>
                    <h1>{titulos[pagina]}</h1>
                    <p>
                      Administra la información de tu negocio desde este panel.
                    </p>
                  </div>
                </div>
                {pagina === "inicio" ? (
                  <div className="stats-grid">
                    <div className="stat-card">
                      <span>Ventas acumuladas (Turno)</span>
                      <CircleDollarSign />
                      <strong>${cajaActiva.ventas.toFixed(2)}</strong>
                      <small>Caja activa</small>
                    </div>
                    <div className="stat-card">
                      <span>Productos activos</span>
                      <Boxes />
                      <strong>{activos}</strong>
                      <small>Disponibles para venta</small>
                    </div>
                    <div className="stat-card">
                      <span>Usuarios registrados</span>
                      <Users />
                      <strong>{usuarios.length}</strong>
                      <small>Cuentas del personal</small>
                    </div>
                  </div>
                ) : (
                  <section className="panel placeholder">
                    <div className="panel-icon">
                      <Settings size={22} />
                    </div>
                    <h2>Módulo de {titulos[pagina].toLowerCase()}</h2>
                    <p>
                      La navegación está lista. Este módulo se construirá
                      próximamente.
                    </p>
                  </section>
                )}
              </>
            )}

          <Footer />
        </div>
      </main>

      {/* MODALS */}
      {editarProducto && (
        <ModalInventario
          titulo="Editar producto"
          cerrar={() => setEditarProducto(null)}
          guardar={() => {}}
          producto={editarProducto}
          setProducto={setEditarProducto}
        />
      )}

      {editarUsuario && (
        <ModalUsuario
          titulo="Editar usuario"
          cerrar={() => setEditarUsuario(null)}
          guardar={() => {}}
          usuario={editarUsuario}
          setUsuario={setEditarUsuario}
        />
      )}

      {aviso && (
        <div className="toast">
          <span className="toast-check">✓</span>
          {aviso}
        </div>
      )}
    </div>
  );
}
