import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import CollectionModal from "../components/CollectionModal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../src/index.css";


const SubtemaDetail = () => {
  const { id, subIndex } = useParams();
  const [tema, setTema] = useState(null);
  const [subtema, setSubtema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [editingFlashcard, setEditingFlashcard] = useState(null);


  useEffect(() => {
    fetchTema();
    fetchFlashcards();
  }, [id, subIndex]);

  const fetchTema = async () => {
    try {
      const res = await axios.get(`https://rkhqsv30-5173.uks1.devtunnels.ms/api/temas/${id}`);
      setTema(res.data);
      const subIdx = parseInt(subIndex, 10);
      if (res.data.subtemas && res.data.subtemas.length > subIdx) {
        setSubtema(res.data.subtemas[subIdx]);
      }
    } catch (error) {
      console.error("Error al obtener el tema:", error);
    } finally {
      setLoading(false);
    }
  };

const fetchFlashcards = async () => {
  if (!subtema || !subtema._id) {
    console.error("Error: subtema es null o no tiene _id");
    return; // Evita llamar a la API si no hay subtema
  }

  try {
    const res = await axios.get(
      `https://rkhqsv30-5173.uks1.devtunnels.ms/api/flashcards/${subtema._id}`
    );
    setFlashcards(res.data);
  } catch (error) {
    console.error("Error al obtener las flashcards:", error);
  }
};

  const handleAgregarFlashcard = async (e) => {
    e.preventDefault();
  
    const nuevaFlashcard = { 
      pregunta, 
      respuesta: respuesta.replace(/<[^>]*>/g, ''), // Elimina etiquetas HTML
      temaId,  
      subtemaId // ⬅️ Agregar este campo
    };
  
    console.log("Enviando Flashcard:", nuevaFlashcard);
  
    try {
      const res = await axios.post(
        "https://rkhqsv30-5173.uks1.devtunnels.ms/api/flashcards",
        nuevaFlashcard,
        { headers: { "Content-Type": "application/json" } }
      );
      setFlashcards([...flashcards, res.data]);
      setPregunta("");
      setRespuesta("");
    } catch (error) {
      console.error("Error al agregar la flashcard:", error.response?.data || error.message);
    }
  };

  const handleEliminarFlashcard = async (flashcardId) => {
    try {
      await axios.delete(`https://rkhqsv30-5173.uks1.devtunnels.ms/api/flashcards/${flashcardId}`);
      setFlashcards(flashcards.filter((f) => f._id !== flashcardId));
    } catch (error) {
      console.error("Error al eliminar la flashcard:", error);
    }
  };

  const handleEditarFlashcard = (flashcard) => {
    setEditingFlashcard(flashcard);
    setPregunta(flashcard.pregunta);
    setRespuesta(flashcard.respuesta);
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    if (!editingFlashcard) return;
    try {
      const updatedFlashcard = { ...editingFlashcard, pregunta, respuesta };
      await axios.put(`https://rkhqsv30-5173.uks1.devtunnels.ms/api/flashcards/${editingFlashcard._id}`, updatedFlashcard);
      setFlashcards(flashcards.map((f) => (f._id === editingFlashcard._id ? updatedFlashcard : f)));
      setEditingFlashcard(null);
      setPregunta("");
      setRespuesta("");
    } catch (error) {
      console.error("Error al editar la flashcard:", error);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!tema || !subtema) return <p>No se encontró el subtema.</p>;

  return (
    <div className="container" style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 2 }}>
        <Link to={`/temas/${id}`}>← Volver al tema</Link>
        <h2>{subtema.nombre}</h2>
        <p>Colecciones del subtema:</p>
        <div className="grid-container">
          {subtema.colecciones && subtema.colecciones.length > 0 ? (
            subtema.colecciones.map((coleccion) => (
              <div key={coleccion._id} className="card">
                <h3 className="card-title">{coleccion.nombre}</h3>
                {coleccion.imagenUrl && <img src={coleccion.imagenUrl} alt={coleccion.nombre} />}
                <div className="card-content">
                  {coleccion.contenido &&
                    (() => {
                      try {
                        const parsedContenido = JSON.parse(coleccion.contenido);
                        return parsedContenido.map((seccion, index) => (
                          <div key={index} className="section">
                            {seccion.tituloSecundario && <h4 className="section-title">{seccion.tituloSecundario}</h4>}
                            <div dangerouslySetInnerHTML={{ __html: seccion.contenido }} />
                          </div>
                        ));
                      } catch (error) {
                        console.error("Error al parsear contenido de colección:", error);
                        return <p>Error al cargar contenido.</p>;
                      }
                    })()}
                </div>
              </div>
            ))
          ) : (
            <p>No hay colecciones en este subtema.</p>
          )}
        </div>
      </div>

      {/* Panel lateral de Flashcards */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#f5f5f5",
          padding: "1rem",
          borderRadius: "8px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <h3>Flashcards</h3>
        {flashcards.length > 0 ? (
          flashcards.map((flashcard) => (
            <div key={flashcard._id} style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
              <p><strong>Pregunta:</strong> {flashcard.pregunta}</p>
              <div dangerouslySetInnerHTML={{ __html: flashcard.respuesta }} />
              <button onClick={() => handleEditarFlashcard(flashcard)}>✏️</button>
              <button onClick={() => handleEliminarFlashcard(flashcard._id)}>🗑️</button>
            </div>
          ))
        ) : (
          <p>No hay flashcards aún.</p>
        )}

        {/* Formulario para agregar/editar flashcards */}
        <form onSubmit={editingFlashcard ? handleGuardarEdicion : handleAgregarFlashcard} style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            placeholder="Pregunta"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            required
          />
          <ReactQuill
            theme="snow"
            value={respuesta}
            onChange={setRespuesta}
            placeholder="Escribe la respuesta..."
          />
          <button type="submit" style={{ alignSelf: "center", padding: "8px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            {editingFlashcard ? "Guardar Edición" : "Agregar Flashcard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubtemaDetail;
