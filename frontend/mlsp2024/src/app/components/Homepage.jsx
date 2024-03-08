'use client';
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';
import Slider from '@mui/material/Slider';

export default function Home() {
  const [oracion, setOracion] = useState('');
  const [palabraCompleja, setPalabraCompleja] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const [evaluacion, setEvaluacion] = useState(50); // Estado para almacenar la evaluación del usuario


  const obtenerOracion = async () => {
    setCargando(true);
    try {
      const res = await axios.post('/api/openai/obtenerOracion');
      setOracion(res.data.oracion);
      setPalabraCompleja(res.data.seleccionada);
      setEvaluacion(50); // Restablecer la evaluación a 50 para la nueva oración
      setMostrarContenido(true);
    } catch (error) {
      console.error('Hubo un error al obtener la oración:', error);
    }
    setCargando(false);
  };


  const enviarEvaluacion = async () => {
    setCargando(true);
    try {
      const payload = {
        oracion: oracion,
        palabraCompleja: palabraCompleja,
        evaluacion: evaluacion
      };
      // Replace '/api/guardarOracion' with your actual endpoint path
      await axios.post('/api/guardarOracion', payload);

      // Obtener una nueva oración después de enviar la evaluación
      await obtenerOracion();
    } catch (error) {
      console.error('Hubo un error al enviar la evaluación:', error);
    }
    setCargando(false);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.splashScreen} ${mostrarContenido ? styles.ocultarSplash : ''}`}>
        <h1 className={styles.title}>Evaluador de Complejidad de Texto</h1>
        <p className={styles.description}>Bienvenidos a nuestro proyecto de simplificación lexicográfica, 
        una iniciativa diseñada para hacer los textos más accesibles para quienes están aprendiendo el idioma, 
        tienen un vocabulario limitado o enfrentan dificultades intelectuales. 
        En este proyecto, colaborarás con nosotros al evaluar oraciones generadas sinteticamente por Inteligencia Artificial. Se te dará una oración y una palabra específica.
        Se te pedirá que evalúes la dificultad de esa palabra en el contexto de la oración en una escala de 0 a 100, 
        donde 0 significa que la palabra no presenta complejidad en la oración y no necesita ser simplificada, 
        y 100 indica que la palabra es extremadamente difícil y debe ser simplificada. 
        Aunque la oración pueda contener otras palabras complejas o ser compleja por su construcción, nos centraremos únicamente en la palabra asignada. 
          Esta plataforma está abierta para que participes todas las veces que desees, contribuyendo así a hacer los textos más comprensibles para todos.
           ¡Agradecemos tu colaboración en este esfuerzo por simplificar la comunicación!</p>
        <button className={styles.button} onClick={obtenerOracion} disabled={cargando}>
          {cargando ? 'Cargando...' : 'Comenzar'}
        </button>
      </div>
      <div className={`${styles.contenidoPrincipal} ${!mostrarContenido ? styles.conDesenfoque : ''} ${mostrarContenido ? '' : styles.ocultarContenido}`}>
        {oracion && (
          <>
            <p className={styles.oracion}>{oracion}</p>
            <p className={styles.palabraCompleja}>Palabra a evaluar: <strong>{palabraCompleja}</strong></p>
            <Slider
              aria-label="Dificultad"
              defaultValue={50}
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={100}
              color='success'
              onChange={(event, newValue) => {
                setEvaluacion(newValue); // Actualiza el estado de la evaluación con el nuevo valor
              }}
              value={evaluacion} // Establece el valor del Slider basado en el estado de evaluación
            />
            <button className={styles.button_send} onClick={enviarEvaluacion} disabled={cargando}>
              {cargando ? 'Enviando...' : 'Enviar'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
