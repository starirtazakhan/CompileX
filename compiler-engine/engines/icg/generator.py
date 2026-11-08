from engines.lexical.lexer import analyze as lexical_analyze
from engines.syntax.parser import analyze as syntax_analyze
from engines.semantic.analyzer import analyze as semantic_analyze


class IntermediateCodeGenerator:

    def __init__(self, ast):

        self.ast = ast
        self.instructions = []
        self.temp_counter = 0
        self.label_counter = 0

    def new_temp(self):

        self.temp_counter += 1

        return f"T{self.temp_counter}"

    def new_label(self):

        self.label_counter += 1

        return f"L{self.label_counter}"

    def generate(self):

        for statement in self.ast.get("body", []):
            self.generate_statement(statement)

        return self.instructions

    def generate_statement(self, statement):

        statement_type = statement["type"]

        if statement_type == "Declaration":

            name = statement["name"]

            if statement["value"] is not None:

                value = self.generate_expression(statement["value"])

                self.instructions.append(
                    f"{name} = {value}"
                )

        elif statement_type == "Assignment":

            value = self.generate_expression(statement["value"])

            self.instructions.append(
                f"{statement['name']} = {value}"
            )

        elif statement_type == "Print":

            value = self.generate_expression(statement["expression"])

            self.instructions.append(
                f"DISPLAY {value}"
            )

        elif statement_type == "IfStatement":

            condition = self.generate_expression(statement["condition"])

            else_label = self.new_label()
            end_label = self.new_label()

            self.instructions.append(
                f"IF_FALSE {condition} GOTO {else_label}"
            )

            for item in statement["consequent"]:
                self.generate_statement(item)

            self.instructions.append(
                f"GOTO {end_label}"
            )

            self.instructions.append(
                f"{else_label}:"
            )

            for item in statement["alternate"]:
                self.generate_statement(item)

            self.instructions.append(
                f"{end_label}:"
            )

        elif statement_type == "RepeatStatement":

            start_label = self.new_label()
            end_label = self.new_label()

            self.instructions.append(
                f"{start_label}:"
            )

            condition = self.generate_expression(statement["condition"])

            self.instructions.append(
                f"IF_FALSE {condition} GOTO {end_label}"
            )

            for item in statement["body"]:
                self.generate_statement(item)

            self.instructions.append(
                f"GOTO {start_label}"
            )

            self.instructions.append(
                f"{end_label}:"
            )

    def generate_expression(self, expression):

        expression_type = expression["type"]

        if expression_type == "Number":
            return str(expression["value"])

        if expression_type == "String":
            return f'"{expression["value"]}"'

        if expression_type == "Boolean":
            return str(expression["value"]).lower()

        if expression_type == "Identifier":
            return expression["name"]

        if expression_type == "UnaryExpression":

            operand = self.generate_expression(
                expression["operand"]
            )

            temp = self.new_temp()

            self.instructions.append(
                f"{temp} = -{operand}"
            )

            return temp

        if expression_type in ("BinaryExpression", "Condition"):

            left = self.generate_expression(expression["left"])
            right = self.generate_expression(expression["right"])

            operator = expression["operator"]

            temp = self.new_temp()

            self.instructions.append(
                f"{temp} = {left} {operator} {right}"
            )

            return temp

        return "UNKNOWN"


def generate(source_code):

    lexical_result = lexical_analyze(source_code)

    if not lexical_result["success"]:

        return {
            "success": False,
            "intermediate_code": [],
            "errors": lexical_result["errors"],
            "stage": "icg"
        }

    syntax_result = syntax_analyze(source_code)

    if not syntax_result["success"]:

        return {
            "success": False,
            "intermediate_code": [],
            "errors": syntax_result["errors"],
            "stage": "icg"
        }

    semantic_result = semantic_analyze(source_code)

    if not semantic_result["success"]:

        return {
            "success": False,
            "intermediate_code": [],
            "errors": semantic_result["errors"],
            "stage": "icg"
        }

    generator = IntermediateCodeGenerator(syntax_result["ast"])

    instructions = generator.generate()

    return {
        "success": True,
        "intermediate_code": instructions,
        "errors": [],
        "stage": "icg"
    }