import os
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add compiler-engine directory to Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

# Import compiler engines
from engines.lexical.lexer import analyze as lexical_analyze
from engines.syntax.parser import analyze as syntax_analyze
from engines.semantic.analyzer import analyze as semantic_analyze
from engines.icg.generator import generate as icg_generate
from engines.execution.interpreter import execute as execute_program


# Initialize FastAPI application
app = FastAPI(
    title="CompileX Compiler API",
    description="Compiler construction and analysis platform.",
    version="1.1.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Request model
class CompilerRequest(BaseModel):
    source_code: str


# Health check
@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "CompileX Compiler API is running."
    }


# 1. Lexical Analysis
@app.post("/api/compiler/lexical")
def lexical_analysis(request: CompilerRequest):
    return lexical_analyze(request.source_code)


# 2. Syntax Analysis
@app.post("/api/compiler/syntax")
def syntax_analysis(request: CompilerRequest):
    return syntax_analyze(request.source_code)


# 3. Semantic Analysis
@app.post("/api/compiler/semantic")
def semantic_analysis(request: CompilerRequest):
    return semantic_analyze(request.source_code)


# 4. Intermediate Code Generation
@app.post("/api/compiler/icg")
def intermediate_code_generation(request: CompilerRequest):
    return icg_generate(request.source_code)


# 5. Run All Compiler Stages
@app.post("/api/compiler/run-all")
def run_all(request: CompilerRequest):

    source_code = request.source_code

    lexical_result = lexical_analyze(source_code)

    if not lexical_result["success"]:
        return {
            "success": False,
            "failed_stage": "LEXICAL",
            "lexical": lexical_result,
            "syntax": None,
            "semantic": None,
            "icg": None
        }

    syntax_result = syntax_analyze(source_code)

    if not syntax_result["success"]:
        return {
            "success": False,
            "failed_stage": "SYNTAX",
            "lexical": lexical_result,
            "syntax": syntax_result,
            "semantic": None,
            "icg": None
        }

    semantic_result = semantic_analyze(source_code)

    if not semantic_result["success"]:
        return {
            "success": False,
            "failed_stage": "SEMANTIC",
            "lexical": lexical_result,
            "syntax": syntax_result,
            "semantic": semantic_result,
            "icg": None
        }

    icg_result = icg_generate(source_code)

    return {
        "success": icg_result["success"],
        "failed_stage": None,
        "lexical": lexical_result,
        "syntax": syntax_result,
        "semantic": semantic_result,
        "icg": icg_result
    }


# 6. Program Execution
@app.post("/api/compiler/execute")
def execute(request: CompilerRequest):
    return execute_program(request.source_code) 