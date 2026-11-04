import { useState } from 'react';
import { 
  DollarSign, 
  ArrowDownCircle, 
  Receipt, 
  Lock, 
  Unlock, 
  Save, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';

export default function CorteCaja({ 
  cajaActiva, 
  abrirCaja, 
  registrarGasto, 
  realizarCorte 
}) {
  const [montoInicial, setMontoInicial] = useState('');
  const [conceptoGasto, setConceptoGasto] = useState('');
  const [montoGasto, setMontoGasto] = useState('');
  const [efectivoReal, setEfectivoReal] = useState('');
  const [tipoCorte, setTipoCorte] = useState('parcial');

  const handleAbrir = (e) => {
    e.preventDefault();
    if (!montoInicial || Number(montoInicial) < 0) return;
    abrirCaja(Number(montoInicial));
    setMontoInicial('');
  };

  const handleGasto = (e) => {
    e.preventDefault();
    if (!conceptoGasto.trim() || !montoGasto || Number(montoGasto) <= 0) return;
    registrarGasto({
      concepto: conceptoGasto.trim(),
      monto: Number(montoGasto),
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setConceptoGasto('');
    setMontoGasto('');
  };

  const handleCorte = (e) => {
    e.preventDefault();
    if (efectivoReal === '' || Number(efectivoReal) < 0) return;
    realizarCorte({
      efectivoReal: Number(efectivoReal),
      tipoCorte
    });
    setEfectivoReal('');
  };

  // 1. PANTALLA SI LA CAJA ESTÁ CERRADA
  if (!cajaActiva || cajaActiva.estado === 'cerrada') {
    return (
      <>
        <div className="page-heading">
          <div>
            <div className="eyebrow">CONTROL FINANCIERO</div>
            <h1>Apertura de Caja</h1>
            <p>Registra el efectivo inicial para dar cambio antes de comenzar.</p>
          </div>
          <span className="pill pill-gray">Caja Cerrada</span>
        </div>

        <section className="panel placeholder">
          <div className="panel-icon">
            <Lock size={22} />
          </div>
          <h2>La caja está actualmente cerrada</h2>
          <p>Ingresa el monto de cambio inicial para habilitar las ventas del turno.</p>
          
          <form onSubmit={handleAbrir} className="user-form" style={{ maxWidth: '340px', margin: '0 auto', display: 'grid', gap: '14px' }}>
            <label>
              Fondo inicial para cambio ($)
              <input 
                type="number" 
                step="0.50" 
                required 
                placeholder="Ej. 300.00" 
                value={montoInicial} 
                onChange={(e) => setMontoInicial(e.target.value)} 
              />
            </label>
            <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
              <Unlock size={17} /> Abrir Caja para Turno
            </button>
          </form>
        </section>
      </>
    );
  }

  // 2. CÁLCULOS DE ENTORNO
  const fondo = cajaActiva.montoInicial || 0;
  const ventas = cajaActiva.ventas || 0;
  const gastosTotales = cajaActiva.gastosTotales || 0;
  const efectivoEsperado = (fondo + ventas) - gastosTotales;

  const contado = efectivoReal !== '' ? Number(efectivoReal) : null;
  const diferencia = contado !== null ? contado - efectivoEsperado : null;

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">CONTROL FINANCIERO</div>
          <h1>Corte de Caja y Registro de Gastos</h1>
          <p>Balance en tiempo real, registro de egresos matutinos y arqueo final del turno.</p>
        </div>
        <span className="pill pill-green">Caja Abierta</span>
      </div>

      {/* BLOQUE DE TARJETAS (STATS) */}
      <div className="stats-grid" style={{ marginBottom: '19px' }}>
        <div className="stat-card">
          <span>Fondo Inicial (Cambio)</span>
          <DollarSign />
          <strong>${fondo.toFixed(2)}</strong>
          <small>Monedas y billetes chicos</small>
        </div>

        <div className="stat-card">
          <span>Ventas Acumuladas</span>
          <Receipt />
          <strong style={{ color: '#16a34a' }}>+${ventas.toFixed(2)}</strong>
          <small>Cobros realizados en el turno</small>
        </div>

        <div className="stat-card">
          <span>Gastos Registrados</span>
          <ArrowDownCircle />
          <strong style={{ color: '#dc2626' }}>-${gastosTotales.toFixed(2)}</strong>
          <small>Insumos / compras rápidas</small>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '19px' }}>
        
        {/* SECCIÓN IZQUIERDA: GASTOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '19px' }}>
          
          <section className="panel">
            <div className="panel-title">
              <div>
                <h2>Registrar Gasto Operativo</h2>
                <p>Anota salidas de dinero para compras matutinas (verdura, gas, hielo, etc.).</p>
              </div>
              <div className="panel-icon">
                <ArrowDownCircle size={19} />
              </div>
            </div>

            <form className="form-grid" onSubmit={handleGasto} style={{ gridTemplateColumns: '1.5fr 1fr auto' }}>
              <label>
                Concepto / ¿En qué se gastó?
                <input 
                  required 
                  value={conceptoGasto} 
                  onChange={(e) => setConceptoGasto(e.target.value)} 
                  placeholder="Ej. Cilantro y cebolla matutina" 
                />
              </label>
              <label>
                Monto gastado ($)
                <input 
                  required 
                  type="number" 
                  step="0.50" 
                  value={montoGasto} 
                  onChange={(e) => setMontoGasto(e.target.value)} 
                  placeholder="0.00" 
                />
              </label>
              <button className="btn-primary" type="submit">
                <Plus size={16} /> Guardar
              </button>
            </form>
          </section>

          <section className="panel table-panel">
            <div className="table-heading">
              <div>
                <h2>Gastos del Turno Actual</h2>
                <p>{cajaActiva.gastos ? cajaActiva.gastos.length : 0} egresos anotados</p>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>HORA</th>
                    <th>CONCEPTO</th>
                    <th className="right">MONTO</th>
                  </tr>
                </thead>
                <tbody>
                  {cajaActiva.gastos && cajaActiva.gastos.length > 0 ? (
                    cajaActiva.gastos.map((g, i) => (
                      <tr key={i}>
                        <td className="muted">{g.hora}</td>
                        <td><b>{g.concepto}</b></td>
                        <td className="right price" style={{ color: '#dc2626' }}>
                          -${g.monto.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="empty">
                        No hay gastos registrados en este turno.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* SECCIÓN DERECHA: ARQUEO Y CORTE (TARJETA DISEÑADA) */}
        <section className="panel" style={{ height: 'fit-content' }}>
          <div className="panel-title">
            <div>
              <h2>Arqueo y Corte de Caja</h2>
              <p>Valida el dinero contado contra el monto esperado en sistema.</p>
            </div>
            <div className="panel-icon">
              <DollarSign size={19} />
            </div>
          </div>

          {/* Tarjeta destacada de Efectivo Esperado */}
          <div style={{ background: '#f8fafc', border: '1px solid #edf0f3', padding: '16px', borderRadius: '12px', marginBottom: '18px' }}>
            <span style={{ fontSize: '11px', color: '#98a1ae', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Fondo + Ventas - Gastos
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#263142' }}>Efectivo esperado en caja:</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px' }}>
                ${efectivoEsperado.toFixed(2)}
              </span>
            </div>
          </div>

          <form onSubmit={handleCorte} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="modal" style={{ padding: 0, width: '100%', boxShadow: 'none', background: 'transparent', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label>
                Tipo de corte a realizar
                <select value={tipoCorte} onChange={(e) => setTipoCorte(e.target.value)}>
                  <option value="parcial">Corte Parcial (Medio día)</option>
                  <option value="cierre">Cierre Definitivo (Fin del día)</option>
                </select>
              </label>

              <label>
                Efectivo físico contado ($)
                <input 
                  required 
                  type="number" 
                  step="0.50" 
                  value={efectivoReal} 
                  onChange={(e) => setEfectivoReal(e.target.value)} 
                  placeholder="Ingresa todo el dinero en la caja" 
                />
              </label>
            </div>

            {/* Píldora de descuadre / cuadre */}
            {diferencia !== null && (
              <div 
                className={`pill ${diferencia === 0 ? 'pill-green' : diferencia < 0 ? 'pill-orange' : 'pill-gray'}`}
                style={{ padding: '11px 14px', borderRadius: '10px', justifyContent: 'center', fontSize: '11px', gap: '8px' }}
              >
                {diferencia === 0 && (
                  <>
                    <CheckCircle2 size={16} /> <b>Caja cuadrada perfectamente ($0.00)</b>
                  </>
                )}
                {diferencia < 0 && (
                  <>
                    <AlertCircle size={16} /> <b>Faltante en caja: -${Math.abs(diferencia).toFixed(2)}</b>
                  </>
                )}
                {diferencia > 0 && (
                  <>
                    <HelpCircle size={16} /> <b>Sobrante en caja: +${diferencia.toFixed(2)}</b>
                  </>
                )}
              </div>
            )}

            <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', height: '42px', marginTop: '4px' }}>
              <Lock size={16} /> 
              {tipoCorte === 'parcial' ? 'Procesar Corte Parcial' : 'Realizar Cierre Definitivo'}
            </button>
          </form>
        </section>

      </div>
    </>
  );
}