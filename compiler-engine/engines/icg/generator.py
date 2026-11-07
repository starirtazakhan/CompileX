import json

from engines.lexical.lexer import analyze as lexical_analyze
from engines.syntax.parser import analyze as syntax_analyze
from engines.semantic.analyzer import analyze as semantic_analyze


class IntermediateCodeGenerator:

    def __init__(self, ast):

        self.ast = ast
        self.instructions = []

        self.temp_counter = 0
        self.label_counter = 0

    # --------------------------------
    # Generate Temporary Variables
    # --------------------------------

    def new_temp(self):

        self.temp_counter += 1

        return f"t{self.temp_counter}"

    # --------------------------------
    # Generate Labels
    # --------------------------------

    def new_label(self):

        self.label_counter += 1

        return f"L{self.label_counter}"

    # --------------------------------
    # Main Code Generation
    # --------------------------------

    def generate(self):

        for statement in self.ast["body"]:

            self.generate_statement(statement)

        return {
            "success": True,
            "intermediate_code": self.instructions
        }

    # --------------------------------
    # Statement Generation
    # --------------------------------

    def generate_statement(self, statement):

        statement_type = statement["type"]

        # Declaration

        if statement_type == "Declaration":

            initializer = statement["initializer"]

            if initializer is not None:

                value = self.generate_expression(initializer)

                self.instructions.append(
                    f"{statement['identifier']} = {value}"
                )

        # Assignment

        elif statement_type == "Assignment":

            value = self.generate_expression(
                statement["expression"]
            )

            self.instructions.append(
                f"{statement['identifier']} = {value}"
            )

        # Print

        elif statement_type == "Print":

            value = self.generate_expression(
                statement["expression"]
            )

            self.instructions.append(
                f"print {value}"
            )

        # If / Else

        elif statement_type == "IfStatement":

            self.generate_if(statement)

    # --------------------------------
    # If / Else Generation
    # --------------------------------

    def generate_if(self, statement):

        condition = statement["condition"]

        left = self.generate_expression(
            condition["left"]
        )

        right = self.generate_expression(
            condition["right"]
        )

        operator = condition["operator"]

        else_label = self.new_label()

        end_label = self.new_label()

        self.instructions.append(
            f"ifFalse {left} {operator} {right} goto {else_label}"
        )

        for child_statement in statement["then_body"]:

            self.generate_statement(child_statement)

        if statement["else_body"]:

            self.instructions.append(
                f"goto {end_label}"
            )

            self.instructions.append(
                f"{else_label}:"
            )

            for child_statement in statement["else_body"]:

                self.generate_statement(child_statement)

            self.instructions.append(
                f"{end_label}:"
            )

        else:

            self.instructions.append(
                f"{else_label}:"
            )

    # --------------------------------
    # Expression Generation
    # --------------------------------

    def generate_expression(self, expression):

        expression_type = expression["type"]

        # Number

        if expression_type == "Number":

            return expression["value"]

        # String

        elif expression_type == "String":

            return json.dumps(expression["value"])

        # Identifier

        elif expression_type == "Identifier":

            return expression["name"]

        # Unary Expression

        elif expression_type == "UnaryExpression":

            operand = self.generate_expression(
                expression["operand"]
            )

            if expression["operator"] == "+":
                return operand

            temp = self.new_temp()

            self.instructions.append(
                f"{temp} = -{operand}"
            )

            return temp

        # Binary Expression

        elif expression_type == "BinaryExpression":

            left = self.generate_expression(
                expression["left"]
            )

            right = self.generate_expression(
                expression["right"]
            )

            temp = self.new_temp()

            self.instructions.append(
                f"{temp} = {left} {expression['operator']} {right}"
            )

            return temp

        return None


# --------------------------------
# Public API
# --------------------------------

def generate(source_code):

    # Step 1: Lexical Analysis

    lexical_result = lexical_analyze(source_code)

    if not lexical_result["success"]:

        return {
            "success": False,
            "stage": "LEXICAL",
            "errors": lexical_result["errors"],
            "intermediate_code": []
        }

    # Step 2: Syntax Analysis

    syntax_result = syntax_analyze(source_code)

    if not syntax_result["success"]:

        return {
            "success": False,
            "stage": "SYNTAX",
            "errors": syntax_result["errors"],
            "intermediate_code": []
        }

    # Step 3: Semantic Analysis

    semantic_result = semantic_analyze(source_code)

    if not semantic_result["success"]:

        return {
            "success": False,
            "stage": "SEMANTIC",
            "errors": semantic_result["errors"],
            "intermediate_code": []
        }

    # Step 4: Generate Intermediate Code

    generator = IntermediateCodeGenerator(
        syntax_result["ast"]
    )

    result = generator.generate()

    result["stage"] = "ICG"
    result["errors"] = []

    return result