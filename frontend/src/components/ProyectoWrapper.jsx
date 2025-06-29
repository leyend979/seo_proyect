// src/components/ProyectoWrapper.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ThreeColumnLayout from './ThreeColumnLayout';

const ProyectoWrapper = ({ setProyectoActual }) => {
  const { proyectoId } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!proyectoId) return;

    axios.get(`https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/proyectos/${proyectoId}`)
      .then(res => {
        setProyecto(res.data);
        setProyectoActual(res.data);
      })
      .catch(err => {
        console.error('No se pudo cargar el proyecto:', err);
        navigate('/');
      });
  }, [proyectoId]);

  if (!proyecto) return <div>Cargando proyecto...</div>;

  return <ThreeColumnLayout proyectoActual={proyecto} />;

};

export default ProyectoWrapper;