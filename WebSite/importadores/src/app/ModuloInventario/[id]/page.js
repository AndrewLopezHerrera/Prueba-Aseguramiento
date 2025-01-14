'use client';

import { useState, useEffect } from 'react';
import styles from '../inventario.module.css';

const ProductoDetalle = () => {
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const rutaActual = window.location.pathname;
    const partesRuta = rutaActual.split('/');
    const nombreArchivoActual = partesRuta[partesRuta.length - 1];
    const idActual = parseInt(nombreArchivoActual);
    if (idActual) {
      fetch(`http://localhost:4000/ConsultarProductoEspecifico`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idActual })
      })
      .then(res => res.json())
      .then(data => setProducto(data))
      .catch(error => console.error('Error al obtener los detalles de los productos:', error));
    }
  }, []);

  if (!producto) return <div>Cargando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.detalles}>
        <h2>Detalles del Producto</h2>
        <p><strong>Nombre del producto:</strong> {producto.NombreProducto}</p>
        <p><strong>Nombre del proveedor:</strong> <a href={producto.SitioWebProveedor} target="_blank" rel="noopener noreferrer"><u>{producto.NombreProveedor}</u></a></p>
        <p><strong>Color:</strong> {producto.Color}</p>
        <p><strong>Unidad de empaquetamiento:</strong> {producto.UnidadEmpaquetamiento}</p>
        <p><strong>Empaquetamiento:</strong> {producto.Empaquetamiento}</p>
        <p><strong>Cantidad de empaquetamiento:</strong> {producto.CantidadEmpaquetamiento}</p>
        <p><strong>Marca:</strong> {producto.Marca}</p>
        <p><strong>Tallas / Tamaño:</strong> {producto.Talla}</p>
        <p><strong>Impuesto:</strong> {producto.Impuesto}</p>
        <p><strong>Precio unitario:</strong> {producto.PrecioUnitario}</p>
        <p><strong>Precio de venta:</strong> {producto.PrecioVenta}</p>
        <p><strong>Peso:</strong> {producto.Peso}</p>
        <p><strong>Palabras claves:</strong> {producto.PalabrasClave}</p>
        <p><strong>Cantidad disponible:</strong> {producto.CantidadDisponible}</p>
        <p><strong>Ubicación:</strong> {producto.Ubicacion}</p>
      </div>
    </div>
  );
};

export default ProductoDetalle;