'use client';

import { useState, useEffect } from 'react';
import styles from './inventario.module.css';
import Link from 'next/link';

const Inventarios = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [grupo, setGrupo] = useState('');

  const mostrarInventario = () => {
    fetch('http://localhost:4000/ConsultarProductos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({nombre, grupo})
    })
    .then(res => res.json())
    .then(data => {
      setProductos(data);
    });
  }

  const resetFiltros = () => {
    setNombre('');
    setGrupo('');
    setProductos([]);
    fetch('http://localhost:4000/LimpiarConsultaProductos', {
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
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Consulta de Inventarios</h1>

      <div className={styles.filtros}>
        <input
          type="text"
          name="nombre"
          placeholder="Filtrar por nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          name="grupo"
          placeholder="Filtrar por grupo"
          value={grupo}
          onChange={(e) => setGrupo(e.target.value)}
        />
      </div>
      <div className={styles.filtros}>
        <button onClick={mostrarInventario} className = {styles.button}>Solicitar Productos</button>
        <button onClick={resetFiltros} className = {styles.button}>Restaurar Filtros</button>
      </div>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Nombre del Producto</th>
            <th>Grupo</th>
            <th>Cantidad en Inventario</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.ID}>
              <td>{producto.NombreProducto}</td>
              <td>{producto.Grupo}</td>
              <td>{producto.CantidadDisponible}</td>
              <td>
                <Link href={`/ModuloInventario/${producto.ID}`}>
                  <button className={styles.button}>Ver</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventarios;
