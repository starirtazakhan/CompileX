import sys
import os

sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from engines.icg.generator import generate


# --------------------------------
# TEST 1: Valid Program
# --------------------------------

valid_program = """
int a = 10;
int b = 20;
int result;

result = (a + b) * 5;

print(result);
"""

result = generate(valid_program)

print("\n========== TEST 1 ==========")
print("VALID PROGRAM")

print("Status:", "SUCCESS" if result["success"] else "FAILED")

print("\nIntermediate Code:")

for instruction in result["intermediate_code"]:
    print(instruction)

print("\nErrors:")
print(result["errors"])


# --------------------------------
# TEST 2: Semantic Error
# --------------------------------

invalid_program = """
int a;

b = 20;
"""

result = generate(invalid_program)

print("\n========== TEST 2 ==========")
print("INVALID PROGRAM")

print("Status:", "SUCCESS" if result["success"] else "FAILED")

print("\nStage:", result["stage"])

print("\nErrors:")
print(result["errors"])