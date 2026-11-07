import sys
import os

# Add compiler-engine directory to Python path
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from engines.syntax.parser import analyze

# --------------------------------
# Test 1: Valid Program
# --------------------------------

valid_program = """
int a = 10;
int b = 20;

int sum;

sum = a + b;

print(sum);
"""

result = analyze(valid_program)

print("\n========== TEST 1 ==========")
print("VALID PROGRAM")

print("Status:", "SUCCESS" if result["success"] else "FAILED")

print("\nAST:")

print(result["ast"])

print("\nErrors:")

print(result["errors"])


# --------------------------------
# Test 2: Invalid Syntax
# --------------------------------

invalid_program = """
int a = 10
int b = 20;
"""

result = analyze(invalid_program)

print("\n========== TEST 2 ==========")
print("INVALID PROGRAM")

print("Status:", "SUCCESS" if result["success"] else "FAILED")

print("\nErrors:")

print(result["errors"])


# --------------------------------
# Test 3: Invalid Expression
# --------------------------------

invalid_expression = """
int a;
a = ;
"""

result = analyze(invalid_expression)

print("\n========== TEST 3 ==========")
print("INVALID EXPRESSION")

print("Status:", "SUCCESS" if result["success"] else "FAILED")

print("\nErrors:")

print(result["errors"])