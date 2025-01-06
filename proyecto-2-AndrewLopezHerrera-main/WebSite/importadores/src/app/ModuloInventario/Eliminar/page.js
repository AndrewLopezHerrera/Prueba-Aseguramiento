'use client';

import { useState } from 'react';
import styles from './eliminar.module.css';

const Eliminar = () => {
  const [stockItemID, setStockItemID] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setStockItemID(e.target.value);
  };

  const eliminarProducto = () => {
    fetch('http://localhost:4000/EliminarProducto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ StockItemID: parseInt(stockItemID) }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMensaje('Producto eliminado con éxito.');
          setStockItemID('');
        } else {
          setMensaje('Error al eliminar el producto.');
        }
      })
      .catch(error => {
        console.error('Error al eliminar el producto:', error);
        setMensaje('Error en la comunicación con el servidor.');
      });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Eliminar Producto</h2>
      <div className={styles.formGroup}>
        <label className={styles.label}>StockItemID</label>
        <input
          type="number"
          name="StockItemID"
          placeholder="Ingrese StockItemID a eliminar"
          value={stockItemID}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <button onClick={eliminarProducto} className={styles.button}>Eliminar Producto</button>
      {mensaje && <p className={styles.message}>{mensaje}</p>}
    </div>
  );
};

export default Eliminar;
