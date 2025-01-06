"use client";
import "./home.css";
import clientes from "./images/ImagenCliente.png";
import proveedores from "./images/ImagenProveedores.png";
import ventas from "./images/ImagenVentas.png";
import inventarios from "./images/ImagenInventario.png";
import estadísticas from "./images/ImagenEstadística.png";
import logo from "./images/logo.png";
import inicioSesion from "./images/InicioSesion.png"
import RootLayout from "./layout";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';

export default function Home() {
  const [saludo, setSaludo] = useState('');
  const [hora, setHora] = useState('');

  useEffect(() => {
    const fechaActual = new Date();
    const horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();

    let saludoActual = '';
    if (horas >= 6 && horas < 12) {
      saludoActual = 'Buenos días';
    } else if (horas >= 12 && horas < 18) {
      saludoActual = 'Buenas tardes';
    } else {
      saludoActual = 'Buenas noches';
    }

    const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos
      .toString()
      .padStart(2, '0')}`;

    setSaludo(saludoActual);
    setHora(horaFormateada);
  }, []);

  return (
    <div className="screen">
      <div className="divlogo">
        <div>
          <h1>{saludo}</h1>
          <p>Hora actual: {hora}</p>
        </div>
        <Image src={logo} alt="Logo de la empresa" />
      </div>
      <div className="divbuttons">
        <Link href="/moduloCliente">
          <button className="buttons">
            <Image src={clientes} alt="Botón del módulo de clientes" />
            <h1 className="imagestext">Clientes</h1>
          </button>
        </Link>
        <Link href={"/ModuloProveedores"}>
          <button className="buttons">
            <Image src={proveedores} alt="Botón del módulo de proveedores" />
            <h1 className="imagestext">Proveedores</h1>
          </button>
        </Link>
        <Link href={"/ModuloVentas"}>
          <button className="buttons">
            <Image src={ventas} alt="Botón del módulo de ventas" />
            <h1 className="imagestext">Ventas</h1>
          </button>
        </Link>
        <Link href={"/ModuloInventario"}>
          <button className="buttons">
            <Image src={inventarios} alt="Botón del módulo de inventarios" />
            <h1 className="imagestext">Inventarios</h1>
          </button>
        </Link>
        <Link href={"/ModuloEstadistica"}>
          <button className="buttons">
            <Image src={estadísticas} alt="Botón de los datos estadísticos" />
            <h1 className="imagestext">Datos Estadísticos</h1>
          </button>
        </Link>
        <Link href={"/ModuloInicioSesion"}>
          <button className="buttons">
            <Image src={inicioSesion} alt="Botón de los datos estadísticos" />
            <h1 className="imagestext">Iniciar Sesion</h1>
          </button>
        </Link>
      </div>
    </div>
  );
}

RootLayout({ Home });
