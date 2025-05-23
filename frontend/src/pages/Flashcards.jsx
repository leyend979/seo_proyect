import React, { useState, useEffect } from "react";
import axios from "axios";

const FlashcardSidebar = ({ subtemaId }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (subtemaId) {
      fetchFlashcards();
    }
  }, [subtemaId]);
  console.log("📌 subtemaId recibido en FlashcardSidebar:", subtemaId);


  const fetchFlashcards = async () => {
    try {
      const res = await axios.get(
        `https://super-duper-goggles-r4v7w7wrggfx95v-5173.app.github.dev/api/flashcards/subtema/${subtemaId}`
      );
      setFlashcards(res.data);
    } catch (error) {
      console.error("Error al obtener flashcards:", error);
    }
  };

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) {
      console.error("❌ Error: Pregunta y respuesta son obligatorias.");
      return;
    }
  
    console.log("📩 Enviando datos:", {
      pregunta: question,
      respuesta: answer,
      subtemaId
    });
  
    try {
      const res = await axios.post(
        "https://super-duper-goggles-r4v7w7wrggfx95v-5173.app.github.dev/api/flashcards",
        { pregunta: question, respuesta: answer, subtemaId }
      );
  
      console.log("✅ Flashcard guardada:", res.data);
      setFlashcards([...flashcards, res.data]);
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error("❌ Error al guardar la flashcard:", error.response?.data || error);
    }
  };

  const handleEdit = (flashcard) => {
    setQuestion(flashcard.pregunta);
    setAnswer(flashcard.respuesta);
    setEditingId(flashcard._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://super-duper-goggles-r4v7w7wrggfx95v-5173.app.github.dev/api/flashcards/${id}`);
      setFlashcards(flashcards.filter(f => f._id !== id));
    } catch (error) {
      console.error("Error al eliminar la flashcard:", error);
    }
  };

  return (
    <div className="flashcard-sidebar">
      <h3>📌 Apuntes</h3>
      <div className="flashcard-form">
        <input
          type="text"
          placeholder="Escribe una pregunta..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <textarea
          placeholder="Escribe la respuesta..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button onClick={handleSave}>
          {editingId ? "Actualizar" : "Añadir"}
        </button>
      </div>
      <div className="flashcard-list">
        {flashcards.map((flashcard) => (
          <div key={flashcard._id} className="flashcard-item">
            <p><strong>Q:</strong> {flashcard.pregunta}</p>
            <p><strong>A:</strong> {flashcard.respuesta}</p>
            <div className="flashcard-actions">
              <button onClick={() => handleEdit(flashcard)}>✏️</button>
              <button onClick={() => handleDelete(flashcard._id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardSidebar;





