import sys
import os

# Add compiler-engine directory to Python path
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from engines.lexical.lexer import analyze


source_code = """int a = 10;
int b = 20;

a = 10 @ 5;

print(a);"""

result = analyze(source_code)

print("\n========== LEXICAL ANALYSIS ==========\n")

print("Status:", "SUCCESS" if result["success"] else "FAILED")

print("\nTOKENS:\n")

for token in result["tokens"]:
    print(token)

print("\nERRORS:\n")

if result["errors"]:
    for error in result["errors"]:
        print(error)
else:
    print("No lexical errors detected.")