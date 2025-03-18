const express = require("express");
const flashcardController = require("../controllers/flashController");

const router = express.Router();

router.get("/", flashcardController.getAllFlashcards); // ✅ Ahora GET está definido
router.get("/subtema/:subtemaId", flashcardController.getFlashcardsBySubtema);
router.post("/", flashcardController.createFlashcard);
router.put("/:id", flashcardController.updateFlashcard);
router.delete("/:id", flashcardController.deleteFlashcard);

module.exports = router;

