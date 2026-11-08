from engines.lexical.lexer import analyze as lexical_analyze
from engines.syntax.parser import analyze as syntax_analyze
from engines.semantic.analyzer import analyze as semantic_analyze


class RuntimeErrorException(Exception):
    pass


class Interpreter:

    def __init__(self):

        self.variables = {}
        self.output = []

    def execute(self, ast):

        if ast["type"] != "Program":
            raise RuntimeErrorException("Invalid program AST.")

        for statement in ast["body"]:
            self.execute_statement(statement)

        return {
            "success": True,
            "output": self.output,
            "variables": self.variables
        }

    def execute_statement(self, statement):

        statement_type = statement["type"]

        if statement_type == "Declaration":

            name = statement["name"]

            value = None

            if statement["value"] is not None:
                value = self.evaluate_expression(statement["value"])

            self.variables[name] = value

        elif statement_type == "Assignment":

            name = statement["name"]

            if name not in self.variables:
                raise RuntimeErrorException(
                    f"Variable '{name}' is not declared."
                )

            self.variables[name] = self.evaluate_expression(
                statement["value"]
            )

        elif statement_type == "Print":

            value = self.evaluate_expression(
                statement["expression"]
            )

            self.output.append(str(value))

        elif statement_type == "IfStatement":

            condition = self.evaluate_expression(
                statement["condition"]
            )

            if condition:

                for item in statement["consequent"]:
                    self.execute_statement(item)

            else:

                for item in statement["alternate"]:
                    self.execute_statement(item)

        elif statement_type == "RepeatStatement":

            iteration_count = 0
            maximum_iterations = 10000

            while self.evaluate_expression(statement["condition"]):

                iteration_count += 1

                if iteration_count > maximum_iterations:
                    raise RuntimeErrorException(
                        "Loop stopped: maximum iteration limit exceeded."
                    )

                for item in statement["body"]:
                    self.execute_statement(item)

    def evaluate_expression(self, expression):

        expression_type = expression["type"]

        if expression_type == "Number":
            return expression["value"]

        if expression_type == "String":
            return expression["value"]

        if expression_type == "Boolean":
            return expression["value"]

        if expression_type == "Identifier":

            name = expression["name"]

            if name not in self.variables:
                raise RuntimeErrorException(
                    f"Variable '{name}' is not declared."
                )

            return self.variables[name]

        if expression_type == "UnaryExpression":

            operand = self.evaluate_expression(
                expression["operand"]
            )

            return -operand

        if expression_type == "BinaryExpression":

            left = self.evaluate_expression(expression["left"])
            right = self.evaluate_expression(expression["right"])

            operator = expression["operator"]

            if operator == "><":
                return left + right

            if operator == "<>":
                return left - right

            if operator == "><>":
                return left * right

            if operator == "</>":

                if right == 0:
                    raise RuntimeErrorException(
                        "Division by zero is not allowed."
                    )

                return left / right

        if expression_type == "Condition":

            left = self.evaluate_expression(expression["left"])
            right = self.evaluate_expression(expression["right"])

            operator = expression["operator"]

            if operator == ">>":
                return left > right

            if operator == "<<":
                return left < right

            if operator == "===":
                return left == right

        raise RuntimeErrorException(
            f"Unsupported expression type: {expression_type}"
        )


def execute(source_code):

    lexical_result = lexical_analyze(source_code)

    if not lexical_result["success"]:

        return {
            "success": False,
            "failed_stage": "lexical",
            "errors": lexical_result["errors"],
            "output": [],
            "variables": {},
            "message": "Lexical analysis failed."
        }

    syntax_result = syntax_analyze(source_code)

    if not syntax_result["success"]:

        return {
            "success": False,
            "failed_stage": "syntax",
            "errors": syntax_result["errors"],
            "output": [],
            "variables": {},
            "message": "Syntax analysis failed."
        }

    semantic_result = semantic_analyze(source_code)

    if not semantic_result["success"]:

        return {
            "success": False,
            "failed_stage": "semantic",
            "errors": semantic_result["errors"],
            "output": [],
            "variables": {},
            "message": "Semantic analysis failed."
        }

    try:

        interpreter = Interpreter()

        result = interpreter.execute(syntax_result["ast"])

        return {
            "success": True,
            "failed_stage": None,
            "errors": [],
            "output": result["output"],
            "variables": result["variables"],
            "message": "Program executed successfully."
        }

    except RuntimeErrorException as error:

        return {
            "success": False,
            "failed_stage": "execution",
            "errors": [str(error)],
            "output": [],
            "variables": {},
            "message": "Program execution failed."
        }

    except Exception as error:

        return {
            "success": False,
            "failed_stage": "execution",
            "errors": [str(error)],
            "output": [],
            "variables": {},
            "message": "Unexpected execution error."
        }