import sys
import os

sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from engines.semantic.analyzer import analyze


# --------------------------------
# TEST 1: Valid Program
# --------------------------------

valid_program = """
int age = 20;
float salary = 50000.5;

age = 25;

print(age);
"""

result = analyze(valid_program)

print("\n========== TEST 1 ==========")
print("VALID PROGRAM")

print("Status:", "SUCCESS" if result["success"] else "FAILED")

print("\nSymbol Table:")

for symbol in result["symbol_table"]:
    print(symbol)

print("\nErrors:")
print(result["errors"])


# --------------------------------
# TEST 2: Undeclared Variable
# --------------------------------

undeclared_program = """
int age;

salary = 50000;
"""

result = analyze(undeclared_program)

print("\n========== TEST 2 ==========")
print("UNDECLARED VARIABLE")

print("Status:", "SUCCESS" if result["success"] else "FAILED")

print("\nErrors:")
print(result["errors"])


# --------------------------------
# TEST 3: Duplicate Declaration
# --------------------------------

duplicate_program = """
int age;
float age;
"""

result = analyze(duplicate_program)

print("\n========== TEST 3 ==========")
print("DUPLICATE DECLARATION")

print("Status:", "SUCCESS" if result["success"] else "FAILED")

print("\nErrors:")
print(result["errors"])


# --------------------------------
# TEST 4: Type Mismatch
# --------------------------------

type_mismatch_program = """
int age;
age = 15.5;
"""

result = analyze(type_mismatch_program)

print("\n========== TEST 4 ==========")
print("TYPE MISMATCH")

print("Status:", "SUCCESS" if result["success"] else "FAILED")

print("\nErrors:")
print(result["errors"])