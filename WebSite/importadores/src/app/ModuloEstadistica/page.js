'use client'

import React, { useState } from "react";
import styles from './estadistica.module.css'; // Importar el CSS módulo

const Estadisticas = () => {
  const [selectedSection, setSelectedSection] = useState("montosComprasProveedores");
  const [rollupProveedores, setRollupProveedores] = useState([]);
  const [rollupClientes, setRollupClientes] = useState([]);
  const [nombreProveedor, setNombreProveedor] = useState('');
  const [categoriaProveedor, setCategoriaProveedor] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [categoriaCliente, setCategoriaCliente] = useState('');

  const mostrarProveedores = () => {
    fetch('http://localhost:4000/MostrarEstadisticasProveedores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre: nombreProveedor, categoria: categoriaProveedor })
    })
    .then(res => res.json())
    .then(data => {
      setRollupProveedores(data);
    });
  };

  const mostrarClientes = () => {
    fetch('http://localhost:4000/MostrarEstadisticasClientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre: nombreCliente, categoria: categoriaCliente })
    })
    .then(res => res.json())
    .then(data => {
      setRollupClientes(data);
    });
  };

  // Función para renderizar la sección seleccionada
  const renderSection = () => {
    switch (selectedSection) {
      case "montosComprasProveedores":
        return (
          <div className={styles.container}>
            <h2 className={styles.title}>Montos de Compras por Proveedor</h2>
            <input
              type="text"
              placeholder="Filtrar por nombre"
              value={nombreProveedor}
              onChange={(e) => setNombreProveedor(e.target.value)}
              className={styles.input} // Aplica la clase del módulo
            />
            <input
              type="text"
              placeholder="Filtrar por categoría"
              value={categoriaProveedor}
              onChange={(e) => setCategoriaProveedor(e.target.value)}
              className={styles.input} // Aplica la clase del módulo
            />
            <button onClick={mostrarProveedores} className={styles.button}>Filtrar</button>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Proveedor</th>
                  <th className={styles.th}>Cálculo</th>
                  <th className={styles.th}>Valores</th>
                </tr>
              </thead>
              <tbody>
                {rollupProveedores.map((proveedor, index) => (
                  <tr key={index}>
                    <td className={styles.td}>{proveedor.Proveedores}</td>
                    <td className={styles.td}>{proveedor.Calculo}</td>
                    <td className={styles.td}>${proveedor.Valores}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "montosVentasClientes":
        return (
          <div className={styles.container}>
            <h2 className={styles.title}>Montos de Compras por Cliente</h2>
            <input
              type="text"
              placeholder="Filtrar por nombre"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              className={styles.input} // Aplica la clase del módulo
            />
            <input
              type="text"
              placeholder="Filtrar por categoría"
              value={categoriaCliente}
              onChange={(e) => setCategoriaCliente(e.target.value)}
              className={styles.input} // Aplica la clase del módulo
            />
            <button onClick={mostrarClientes} className={styles.button}>Filtrar</button>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Cliente</th>
                  <th className={styles.th}>Cálculo</th>
                  <th className={styles.th}>Valores</th>
                </tr>
              </thead>
              <tbody>
                {rollupClientes.map((cliente, index) => (
                  <tr key={index}>
                    <td className={styles.td}>{cliente.Clientes}</td>
                    <td className={styles.td}>{cliente.Calculo}</td>
                    <td className={styles.td}>${cliente.Valores}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "top5ProductosGanancia":
        return (
          <div>
            
          </div>
        );
      case "top5ClientesFacturas":
        return (
          <div>
            
          </div>
        );
      case "top5ProveedoresOrdenes":
        return (
          <div>
            
          </div>
        );
      default:
        return <div>Selecciona una opción para ver las estadísticas.</div>;
    }
  };

  return (
    <div className={styles.screen}>
      <header className={styles.barraSuperior}>
        <h1>Estadísticas</h1>
      </header>

      <div className={styles.content}>
        {/* Sección izquierda con los botones */}
        <div className={styles.sidebar}>
          <div className={styles.tittleOption}>Opciones de Estadísticas</div>
          <button onClick={() => setSelectedSection("montosComprasProveedores")}>Montos Compras Proveedores</button>
          <button onClick={() => setSelectedSection("montosVentasClientes")}>Montos Ventas Clientes</button>
          <button onClick={() => setSelectedSection("top5ProductosGanancia")}>Top 5 Productos por Ganancia</button>
          <button onClick={() => setSelectedSection("top5ClientesFacturas")}>Top 5 Clientes por Facturas</button>
          <button onClick={() => setSelectedSection("top5ProveedoresOrdenes")}>Top 5 Proveedores por Órdenes</button>
        </div>

        {/* Sección derecha con el contenido dinámico */}
        <div className={styles.mainContent}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
