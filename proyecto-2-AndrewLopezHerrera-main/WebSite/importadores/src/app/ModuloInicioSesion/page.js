"use client";
import { useState } from 'react';
import styles from './iniciosesion.module.css'; // Asegúrate de tener este archivo CSS

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    console.log("Username:", username);
    console.log("Password:", password);
    // Simulando una respuesta
    if (username === "admin" && password === "1234") {
      setMensaje("Inicio de sesión exitoso");
    } else {
      setMensaje("Nombre de usuario o contraseña incorrectos");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre de Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.button}>Iniciar Sesión</button>
      </form>
      {mensaje && <p className={styles.message}>{mensaje}</p>}
    </div>
  );
};

export default Login;
