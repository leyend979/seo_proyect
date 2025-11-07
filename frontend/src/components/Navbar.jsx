import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { data, useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_BACK_URL
;


const Navbar = ({ proyectoActual, setProyectoActual }) => {
  const [proyectos, setProyectos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_BASE+'/api/proyectos')
      .then(res => setProyectos(res.data))
      .catch(err => {
        console.error('Error al cargar proyectos', err);
        setProyectos([]); // evitar errores si falla
      });
  }, []);

  const seleccionarProyecto = (id) => {
    const proyecto = proyectos.find(p => p._id === id);
    setProyectoActual(proyecto);
    navigate(`/proyecto/${id}`);
  };

  const crearNuevoProyecto = async () => {
    const nombre = prompt("Nombre del nuevo proyecto:");
    if (!nombre || !nombre.trim()) {
      alert("El nombre del proyecto no puede estar vacío.");
      return;
    }

    try {
      
      const res = await axios.post(API_BASE+'api/proyectos', {
        nombre: nombre.trim()
      });
      setProyectos([...proyectos, res.data]);
      seleccionarProyecto(res.data._id);
      console.log(data)
    } catch (err) {
      console.error('Error creando proyecto:', err.response?.data || err.message);
    }
  };

  return (
    <nav style={{
      padding: '1rem',
      background: '#eee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>Proyecto actual:</span>
        <select
          value={proyectoActual?._id || ''}
          onChange={(e) => seleccionarProyecto(e.target.value)}
        >
          <option value="" disabled>Selecciona un proyecto</option>
          {proyectos.map(p => (
            <option key={p._id} value={p._id}>{p.nombre}</option>
          ))}
        </select>
      </div>

      <button onClick={crearNuevoProyecto}>+ Nuevo Proyecto</button>
    </nav>
  );
};

export default Navbar;


