'use client';

import { useState, useEffect } from 'react';
import styles from './proveedores.module.css';
import Link from 'next/link';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('')

  const mostrarProveedores = () => {
    fetch('http://localhost:4000/ConsultarProveedores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({nombre, categoria})
    })
    .then(res => res.json())
    .then(data => {
      setProveedores(data);
    });
  }

  const resetFiltros = () => {
    setNombre('');
    setCategoria('');
    setProveedores([]);
    fetch('http://localhost:4000/LimpiarConsultaProveedores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({nombre, categoria})
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
      <h1 className={styles.title}>Consulta de Proveedores</h1>

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
          name="categoria"
          placeholder="Filtrar por categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
      </div>
      <div className={styles.filtros}>
        <button onClick={mostrarProveedores}>Solicitar Proveedores</button>
        <button onClick={resetFiltros}>Restaurar Filtros</button>
      </div>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Método de entrega</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <tr key={proveedor.id}>
              <td>{proveedor.NombreProveedor}</td>
              <td>{proveedor.CategoriaProveedor}</td>
              <td>{proveedor.MetodoEntrega}</td>
              <td>
                <Link href={`/ModuloProveedores/${proveedor.ID}`}>
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

export default Proveedores;
