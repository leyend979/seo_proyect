import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Proyectos from './pages/Proyectos';
import ThreeColumnLayout from './components/ThreeColumnLayout';
import Navbar from './components/Navbar';
import ProyectoWrapper from './components/ProyectoWrapper';

function App() {
  const [proyectoActual, setProyectoActual] = useState(null);

  return (
    <>
      <Navbar proyectoActual={proyectoActual} setProyectoActual={setProyectoActual} />
      <Routes>
        <Route path="/" element={<Proyectos />} />
        <Route path="/proyecto/:proyectoId" element={<ProyectoWrapper setProyectoActual={setProyectoActual} />} />
        
      </Routes>
    </>
  );
}

export default App;



