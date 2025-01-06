'use client';

import { useState, useEffect } from 'react';
import styles from './ventas.module.css';
import Link from 'next/link';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [fechaInicial, setFechaInicial] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);
  const [montoInicial, setMontoInicial] = useState(null);
  const [montoFinal, setmontoFinal] = useState(null);

  const mostrarFacturas = () => {
    fetch('http://localhost:4000/ConsultarVentas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, fechaInicial, fechaFinal, montoInicial, montoFinal })
    })
    .then(res => res.json())
    .then(data => {
      setVentas(data);
    });
  };
  
  const resetFiltros = () => {
    setNombre('');
    setFechaInicial(null);
    setFechaFinal(null);
    setMontoInicial(null);
    setmontoFinal(null);
    fetch('http://localhost:4000/LimpiarConsultaVentas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(data => {
      
    })
    .catch(error => {
      console.error("Error al limpiar los filtros:", error);
    });
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Consulta de Ventas</h1>

      <div className={styles.filtros}>
        <input
          type="text"
          name="cliente"
          placeholder="Filtrar por cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <small>Fecha de Inicio</small>
        <input
          type="date"
          name="fechaInicio"
          placeholder="Fecha Inicio"
          value={fechaInicial}
          onChange={(e) => setFechaInicial(e.target.value)}
        />
        <small>Fecha final</small>
        <input
          type="date"
          name="fechaFin"
          placeholder="Fecha Fin"
          value={fechaFinal}
          onChange={(e) => setFechaFinal(e.target.value)}
        />
        <input
          type="number"
          name="montoInicio"
          placeholder="Monto Mínimo"
          value={montoInicial}
          onChange={(e) => setMontoInicial(e.target.value)}
        />
        <input
          type="number"
          name="montoFin"
          placeholder="Monto Máximo"
          value={montoFinal}
          onChange={(e) => setmontoFinal(e.target.value)}
        />
      </div>

      <div className={styles.botonesFiltro}>
        <button onClick={mostrarFacturas}>Solicitar Facturas</button>
        <button onClick={resetFiltros}>Restaurar Filtros</button>
      </div>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Número de Factura</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Método de Entrega</th>
            <th>Monto</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr>
              <td>{venta.ID}</td>
              <td>{venta.FechaFactura}</td>
              <td>
                <a href={`${venta.SitioWeb}`}>
                  {venta.NombreCliente}
                </a>
              </td>
              <td>{venta.MetodoEntrega}</td>
              <td>{venta.MONTO}</td>
              <td>
              <Link href={`/ModuloVentas/${venta.ID}`}>
                <button className = {styles.button}>Ver</button>
              </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ventas;
