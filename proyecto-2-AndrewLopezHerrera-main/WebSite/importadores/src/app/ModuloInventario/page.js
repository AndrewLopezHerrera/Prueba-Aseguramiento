'use client'

import { useState } from 'react';
import Seleccionar from './Seleccionar/page';
import Insertar from './Insertar/page';
import Actualizar from './Actualizar/page';
import Eliminar from './Eliminar/page';
import styles from './sidebar.module.css';

const ModuloInventario = () => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('seleccionar');

  const renderOpcionSeleccionada = () => {
    switch (opcionSeleccionada) {
      case 'seleccionar':
        return <Seleccionar />;
      case 'insertar':
        return <Insertar />;
      case 'actualizar':
        return <Actualizar />;
      case 'eliminar':
        return <Eliminar />;
      default:
        return <Insertar />; // Vista predeterminada
    }
  };

  return (
    <div className={styles.container}>
      {/* Botones de la barra lateral */}
      <div className={styles.sidebar}>
        <div>Opciones</div>
        <button onClick={() => setOpcionSeleccionada('seleccionar')}>Seleccionar</button>
        <button onClick={() => setOpcionSeleccionada('insertar')}>Insertar</button>
        <button onClick={() => setOpcionSeleccionada('actualizar')}>Actualizar</button>
        <button onClick={() => setOpcionSeleccionada('eliminar')}>Eliminar</button>
      </div>

      {/* Contenido de la vista seleccionada */}
      <div className={styles.content}>
        {renderOpcionSeleccionada()}
      </div>
    </div>
  );
};

export default ModuloInventario;
