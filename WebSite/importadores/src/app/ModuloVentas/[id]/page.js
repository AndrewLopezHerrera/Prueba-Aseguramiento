'use client';

import { useState, useEffect } from 'react';
import styles from '../ventas.module.css';

const FacturaDetalle = () => {
  const [factura, setFactura] = useState(null);
  const [lineasFactura, setLineasFactura] = useState([]);
  const [id, setId] = useState(null);

  useEffect(() => {
    const rutaActual = window.location.pathname;
    const partesRuta = rutaActual.split('/');
    const nombreArchivoActual = partesRuta[partesRuta.length - 1];
    const idActual = parseInt(nombreArchivoActual);
    setId(idActual);
    if (idActual) {
      fetch(`http://localhost:4000/ConsultarVentaEspecifica`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idActual })
      })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(error => console.error('Error al obtener los detalles del proveedor:', error));
    }
  });

  const setData = (data) => {
    setFactura(data.factura);
    setLineasFactura(data.lineasfactura);
  }

  if (!factura) return <div>Cargando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.encabezado}>
        <h3>Número de Factura: {factura.numeroFactura}</h3>
        <p><strong>Nombre del Cliente:</strong> <a href={`/moduloCliente/${factura.ClienteID}`}>{factura.NombreCliente}</a></p>
        <p><strong>Método de Entrega:</strong> {factura.MetodoEntrega}</p>
        <p><strong>Número de Orden:</strong> {factura.NumeroOrden}</p>
        <p><strong>Persona de Contacto:</strong> {factura.PersonaContacto}</p>
        <p><strong>Nombre del Vendedor:</strong> {factura.Vendedor}</p>
        <p><strong>Fecha de la Factura:</strong> {factura.FechaFactura}</p>
        <p><strong>Instrucciones de Entrega:</strong> {factura.InstruccionesEntrega}</p>
      </div>

      <h3>Detalle de la Factura</h3>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Nombre del Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Impuesto Aplicado</th>
            <th>Monto del Impuesto</th>
            <th>Total por Línea</th>
          </tr>
        </thead>
        <tbody>
          {lineasFactura.map((producto) => (
            <tr key={id}>
              <td><a href={`/ModuloInventario/${id}`}>{producto.NombreProducto}</a></td>
              <td>{producto.Cantidad}</td>
              <td>{producto.PrecioUnitario}</td>
              <td>{producto.ImpuestoAplicado}</td>
              <td>{producto.MontoImpuesto}</td>
              <td>{producto.TotalLinea}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacturaDetalle;
