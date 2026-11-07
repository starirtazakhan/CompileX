const express = require("express");
const router = express.Router();

const {
    createProgram,
    getPrograms,
    getProgramById,
    updateProgram,
    deleteProgram
} = require("../controllers/programController");

const { protect } = require("../middleware/authMiddleware");

// All routes require authentication

// Create a new program
router.post("/", protect, createProgram);

// Get all programs belonging to logged-in user
router.get("/", protect, getPrograms);

// Get a single program
router.get("/:id", protect, getProgramById);

// Update a program
router.patch("/:id", protect, updateProgram);

// Delete a program
router.delete("/:id", protect, deleteProgram);

module.exports = router; 