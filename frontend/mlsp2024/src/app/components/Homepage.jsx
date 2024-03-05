// pages/index.js

'use client';
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css'; // Asegúrate de crear este archivo

export default function Home() {
  const [oracion, setOracion] = useState('');
  const [palabraCompleja, setPalabraCompleja] = useState('');
  const [cargando, setCargando] = useState(false);

  const obtenerOracion = async () => {
    setCargando(true);
    try {
      const res = await axios.get('/api/openai/obtenerOracion');
      setOracion(res.data.oracion);
      setPalabraCompleja(res.data.seleccionada);
    } catch (error) {
      console.error('Hubo un error al obtener la oración:', error);
      setOracion('');
      setPalabraCompleja('');
    }
    setCargando(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Evaluador de Complejidad de Texto</h1>
      <button className={styles.button} onClick={obtenerOracion} disabled={cargando}>
        {cargando ? 'Cargando...' : 'Obtener Oración'}
      </button>
      {oracion && (
        <div className={styles.oracionContainer}>
          <p className={styles.oracion}>{oracion}</p>
          <p className={styles.palabraCompleja}>Palabra a evaluar: <strong>{palabraCompleja}</strong></p>
        </div>
      )}
      {/* Aquí iría el componente de evaluación con el deslizador */}
    </div>
  );
}
