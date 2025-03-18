const Flashcard = require("../models/Flashcard.js");

// Obtener todas las flashcards
exports.getAllFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find();
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las flashcards", error });
  }
};

// Obtener todas las flashcards de un subtema
exports.getFlashcardsBySubtema = async (req, res) => {
  try {
    const { subtemaId } = req.params;
    console.log(`📌 Buscando flashcards para subtemaId: ${subtemaId}`);

    if (!subtemaId) {
      return res.status(400).json({ message: "❌ subtemaId es requerido" });
    }

    const flashcards = await Flashcard.find({ subtemaId });

    if (!flashcards.length) {
      return res.status(404).json({ message: "⚠️ No hay flashcards para este subtema" });
    }

    res.json(flashcards);
  } catch (error) {
    console.error("❌ Error al obtener flashcards:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

// Crear una flashcard asociada a un subtema
exports.createFlashcard = async (req, res) => {
  try {
    console.log("📥 Datos recibidos en backend:", req.body);

    const { pregunta, respuesta, subtemaId } = req.body;

    if (!pregunta || !respuesta || !subtemaId) {
      return res.status(400).json({ 
        message: "❌ Todos los campos son obligatorios.", 
        receivedData: req.body 
      });
    }

    const nuevaFlashcard = new Flashcard({ pregunta, respuesta, subtemaId });
    await nuevaFlashcard.save();
    
    console.log("✅ Flashcard creada:", nuevaFlashcard);
    res.status(201).json(nuevaFlashcard);
  } catch (error) {
    console.error("❌ Error en backend al crear la flashcard:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

// Actualizar una flashcard
exports.updateFlashcard = async (req, res) => {
  try {
    const { pregunta, respuesta } = req.body;
    const { id } = req.params;

    console.log(`🛠️ Actualizando flashcard con id: ${id}`);

    if (!pregunta || !respuesta) {
      return res.status(400).json({ message: "❌ Los campos pregunta y respuesta son obligatorios" });
    }

    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      id,
      { pregunta, respuesta },
      { new: true }
    );

    if (!updatedFlashcard) {
      return res.status(404).json({ message: "Flashcard no encontrada" });
    }

    res.json(updatedFlashcard);
  } catch (error) {
    console.error("❌ Error al actualizar flashcard:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

// Eliminar una flashcard
exports.deleteFlashcard = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando flashcard con id: ${id}`);

    const deletedFlashcard = await Flashcard.findByIdAndDelete(id);

    if (!deletedFlashcard) {
      return res.status(404).json({ message: "Flashcard no encontrada" });
    }

    res.json({ message: "✅ Flashcard eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar flashcard:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

// Exportar todas las funciones


