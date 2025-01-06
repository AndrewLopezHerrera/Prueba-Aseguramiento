'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './clientes.module.css';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const mostrarClientes = () => {
    fetch('http://localhost:4000/ConsultarClientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre: searchTerm })
    })
    .then(res => res.json())
    .then(data => {
      setClientes(data);
    });
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setClientes([]);
    fetch('http://localhost:4000/LimpiarConsultaClientes', {
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
      <h1 className={styles.title}>Clientes</h1>

      <input
        type="text"
        className={styles.searchInput}
        placeholder="Filtrar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button className={styles.button} onClick={mostrarClientes}>Solicitar Clientes</button>
      <button className={styles.button} onClick={limpiarFiltros}>Restaurar Filtros</button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre del Cliente</th>
            <th>Categoría</th>
            <th>Método de Entrega</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.ID}>
              <td>{cliente.Nombre}</td>
              <td>{cliente.Categoria}</td>
              <td>{cliente.MetodoEntrega}</td>
              <td>
                <Link href={`/moduloCliente/${cliente.ID}`}>
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

export default ClientesPage;
