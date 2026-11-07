const axios = require("axios");

const COMPILER_ENGINE_URL =
    process.env.COMPILER_ENGINE_URL ||
    "http://127.0.0.1:8000";

const sendCompilerRequest = async (endpoint, sourceCode) => {
    try {
        const response = await axios.post(
            `${COMPILER_ENGINE_URL}${endpoint}`,
            {
                source_code: sourceCode,
            },
            {
                timeout: 15000,
            }
        );

        return response.data;

    } catch (error) {
        if (error.response) {
            throw new Error(
                error.response.data?.detail ||
                error.response.data?.message ||
                "Compiler engine returned an error."
            );
        }

        throw new Error(
            "Unable to connect to the compiler engine."
        );
    }
};

const runLexicalAnalysis = (sourceCode) =>
    sendCompilerRequest("/api/compiler/lexical", sourceCode);

const runSyntaxAnalysis = (sourceCode) =>
    sendCompilerRequest("/api/compiler/syntax", sourceCode);

const runSemanticAnalysis = (sourceCode) =>
    sendCompilerRequest("/api/compiler/semantic", sourceCode);

const runICG = (sourceCode) =>
    sendCompilerRequest("/api/compiler/icg", sourceCode);

const runAllStages = (sourceCode) =>
    sendCompilerRequest("/api/compiler/run-all", sourceCode);

const runExecution = (sourceCode) =>
    sendCompilerRequest("/api/compiler/execute", sourceCode);

module.exports = {
    runLexicalAnalysis,
    runSyntaxAnalysis,
    runSemanticAnalysis,
    runICG,
    runAllStages,
    runExecution,
};