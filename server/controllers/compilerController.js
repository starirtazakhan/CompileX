const {
    runLexicalAnalysis,
    runSyntaxAnalysis,
    runSemanticAnalysis,
    runICG,
    runAllStages,
    runExecution
} = require("../services/compilerService");

const { createAuditLog } = require("../services/auditService");

const handleCompilerRequest = (compilerFunction, action) => {
    return async (req, res) => {
        try {
            const { sourceCode } = req.body;

            if (
                typeof sourceCode !== "string" ||
                !sourceCode.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Source code is required."
                });
            }

            const result = await compilerFunction(sourceCode);

            await createAuditLog({
                req,
                action,
                resourceType: "COMPILER",
                details: `${action} executed`
            });

            return res.status(200).json({
                success: true,
                result
            });

        } catch (error) {
            console.error(`${action} Error:`, error.message);

            return res.status(500).json({
                success: false,
                message: error.message || "Compiler request failed."
            });
        }
    };
};

const lexicalAnalysis = handleCompilerRequest(
    runLexicalAnalysis,
    "LEXICAL_ANALYSIS"
);

const syntaxAnalysis = handleCompilerRequest(
    runSyntaxAnalysis,
    "SYNTAX_ANALYSIS"
);

const semanticAnalysis = handleCompilerRequest(
    runSemanticAnalysis,
    "SEMANTIC_ANALYSIS"
);

const intermediateCodeGeneration = handleCompilerRequest(
    runICG,
    "ICG_GENERATED"
);

const runAll = handleCompilerRequest(
    runAllStages,
    "RUN_ALL"
);

const executeProgram = handleCompilerRequest(
    runExecution,
    "PROGRAM_EXECUTED"
);

module.exports = {
    lexicalAnalysis,
    syntaxAnalysis,
    semanticAnalysis,
    intermediateCodeGeneration,
    runAll,
    executeProgram
};