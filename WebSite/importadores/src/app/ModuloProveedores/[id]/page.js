'use client';
import { useState, useEffect } from 'react';
import styles from '../proveedores.module.css';

const ProveedorDetalle = () => {
  const [proveedor, setProveedor] = useState(null);

  useEffect(() => {
    const rutaActual = window.location.pathname;
    const partesRuta = rutaActual.split('/');
    const nombreArchivoActual = partesRuta[partesRuta.length - 1];
    const idActual = parseInt(nombreArchivoActual);
    if (idActual) {
      fetch(`http://localhost:4000/ConsultarProveedorEspecifico`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idActual })
      })
      .then(res => res.json())
      .then(data => setProveedor(data))
      .catch(error => console.error('Error al obtener los detalles del proveedor:', error));
    }
  });

  if (!proveedor) return <div>Cargando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.detailCard}>
        <h2 className={styles.locationTitle}>Detalles del Proveedor</h2>
        <p><strong>Código del proveedor:</strong> {proveedor.CodigoProveedor}</p>
        <p><strong>Nombre:</strong> {proveedor.NombreProveedor}</p>
        <p><strong>Categoría:</strong> {proveedor.CategoriaProveedor}</p>
        <p><strong>Contactos:</strong> {proveedor.ContactoPrimario}, {proveedor.ContactoAlternativo}</p>
        <p><strong>Métodos de entrega:</strong> {proveedor.MetodoEntrega}</p>
        <p><strong>Ciudad de entrega:</strong> {proveedor.CiudadEntrega}</p>
        <p><strong>Código postal de entrega:</strong> {proveedor.CodigoPostal}</p>
        <p><strong>Teléfono:</strong> {proveedor.Telefono}</p>
        <p><strong>Fax:</strong> {proveedor.FAX}</p>
        <p><strong>Sitio web:</strong> <a className={styles.link} href={proveedor.SitioWeb} target="_blank" rel="noopener noreferrer">{proveedor.SitioWeb}</a></p>
        <p><strong>Dirección de entrega:</strong> {proveedor.DireccionEntrega1}, {proveedor.DireccionEntrega2}</p>
        <p><strong>Dirección postal:</strong> {proveedor.DireccionPostal1}, {proveedor.DireccionPostal2}</p>
        <p><strong>Nombre del banco:</strong> {proveedor.NombreBanco}</p>
        <p><strong>Número de cuenta corriente:</strong> {proveedor.NumeroCuentaBanco}</p>
        <p><strong>Días de gracia para pagar:</strong> {proveedor.DiasGraciaPago}</p>

        <div className={styles.mapa}>
          {/* Mapa con la localización */}
          <iframe
            src={`https://maps.google.com/maps?q=${proveedor.Localizacion.points[0].lat},${proveedor.Localizacion.points[0].lng}&z=15&output=embed`}
            className={styles.iframe}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ProveedorDetalle;
