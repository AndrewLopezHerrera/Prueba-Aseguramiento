'use client';
import { useState, useEffect } from 'react';
import styles from '../clientes.module.css';

const ClienteDetalle = ({ id }) => {
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    const rutaActual = window.location.pathname;
    const partesRuta = rutaActual.split('/');
    const nombreArchivoActual = partesRuta[partesRuta.length - 1];
    const idActual = parseInt(nombreArchivoActual);
    if (idActual) {
      fetch(`http://localhost:4000/ConsultarClientesEspecifico`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idActual })
      })
      .then(res => res.json())
      .then(data => setCliente(data))
      .catch(error => console.error('Error al obtener los detalles del cliente:', error));
    }
  }, [id]);

  if (!cliente) return <div>Cargando...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalles del Cliente</h1>
      <div className={styles.detailCard}>
        <p><strong>Nombre:</strong> {cliente.Nombre}</p>
        <p><strong>Nombre de Categoria:</strong> {cliente.NombreCategoria}</p>
        <p><strong>Metodo de Entrega:</strong> {cliente.MetodoEntrega}</p>
        <p><strong>Grupo de Compra:</strong> {cliente.GrupoCompra}</p>
        <p><strong>Contacto Primario:</strong> {cliente.ContactoPrimario}</p>
        <p><strong>Contacto Alternativo:</strong> {cliente.ContactoAlternativo}</p>
        <p><strong>Cliente a Facturar:</strong> {cliente.ClienteFacturar}</p>
        <p><strong>Ciudad de Entrega:</strong> {cliente.CiudadEntrega}</p>
        <p><strong>Codigo Postal:</strong> {cliente.CodigoPostal}</p>
        <p><strong>Telefono:</strong> {cliente.Telefono}</p>
        <p><strong>FAX:</strong> {cliente.Fax}</p>
        <p><strong>Dias Gracia para Pagar:</strong> {cliente.DiasGracia}</p>
        <p><strong>Pagina Web:</strong><a href={cliente.PaginaWeb} target="_blank" rel="noopener noreferrer" className={styles.link}>{cliente.PaginaWeb}</a></p>
        <p><strong>Direccion Linea 1:</strong> {cliente.DireccionLinea1}</p>
        <p><strong>Direccion Linea 2:</strong> {cliente.DireccionLinea2}</p>
        <p><strong>Direccion Postal 1:</strong> {cliente.DireccionPostal1}</p>
        <p><strong>Direccion Postal 2:</strong> {cliente.DireccionPostal2}</p>
      </div>

      <h2 className={styles.locationTitle}>Ubicación</h2>
      <iframe
        src={`https://maps.google.com/maps?q=${cliente.Localizacion.points[0].lat},${cliente.Localizacion.points[0].lng}&z=15&output=embed`}
        className={styles.iframe}
      ></iframe>
    </div>
  );
};

export default ClienteDetalle;
