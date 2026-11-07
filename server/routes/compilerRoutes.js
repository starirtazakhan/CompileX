const express = require("express");
const router = express.Router();

const {
    lexicalAnalysis,
    syntaxAnalysis,
    semanticAnalysis,
    intermediateCodeGeneration,
    runAll,
    executeProgram
} = require("../controllers/compilerController");

const { protect } = require("../middleware/authMiddleware");

router.post("/lexical", protect, lexicalAnalysis);

router.post("/syntax", protect, syntaxAnalysis);

router.post("/semantic", protect, semanticAnalysis);

router.post("/icg", protect, intermediateCodeGeneration);

router.post("/run-all", protect, runAll);

router.post("/execute", protect, executeProgram);

module.exports = router;