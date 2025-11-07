// src/pages/Proyectos.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_BACK_URL;

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_BASE+'/api/proyectos')
      .then(res => setProyectos(res.data))
      .catch(err => console.error('Error al cargar proyectos', err));
  }, []);

  const crearNuevoProyecto = async () => {
    const nombre = prompt('Nombre del nuevo proyecto:');
    if (!nombre) return;
    try {
      const res = await axios.post(API_BASE+'/api/proyectos', { nombre });
      setProyectos([...proyectos, res.data]);
    } catch (err) {
      console.error('Error al crear proyecto:', err);
    }
  };

  return (
    <div >
      <div class="header-row">
          <h2>Mis proyectos</h2>
          <button onClick={crearNuevoProyecto}>+ Nuevo Proyecto</button>
        </div>

      <ul>
        {proyectos.map(proy => (
          <li key={proy._id}>
            <button onClick={() => navigate(`/proyecto/${proy._id}`)}>
              {proy.nombre}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Proyectos;

