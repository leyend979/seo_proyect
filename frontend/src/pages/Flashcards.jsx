import React, { useEffect, useState } from "react";
import axios from "axios";

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = () => {
    axios.get("https://curly-meme-x5pr4447w5x6cpv49-5173.app.github.dev/api/flashcards")
      .then(response => setFlashcards(response.data))
      .catch(error => console.error("Error al obtener las flashcards:", error));
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://curly-meme-x5pr4447w5x6cpv49-5173.app.github.dev/api/flashcards", { pregunta, respuesta })
      .then(() => {
        setPregunta(""); 
        setRespuesta(""); 
        fetchFlashcards(); // Refrescar la lista
      })
      .catch(error => console.error("Error al agregar la flashcard:", error));
  };

  return (
    <div>
      <h2>Lista de Flashcards</h2>
      <ul>
        {flashcards.map((flashcard) => (
          <li key={flashcard._id}>
            <strong>Pregunta:</strong> {flashcard.pregunta} <br />
            <strong>Respuesta:</strong> {flashcard.respuesta}
          </li>
        ))}
      </ul>

      <h3>Agregar Nueva Flashcard</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pregunta"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Respuesta"
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          required
        />
        <button type="submit">Agregar Flashcard</button>
      </form>
    </div>
  );
};

export default Flashcards;

