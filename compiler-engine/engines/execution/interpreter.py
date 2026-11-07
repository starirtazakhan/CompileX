from engines.lexical.lexer import analyze as lexical_analyze
from engines.syntax.parser import analyze as syntax_analyze
from engines.semantic.analyzer import analyze as semantic_analyze


class RuntimeErrorException(Exception):
    pass


class Interpreter:

    def __init__(self):

        self.variables = {}
        self.output = []

    # --------------------------------
    # Execute Program
    # --------------------------------

    def execute(self, ast):

        if not isinstance(ast, dict):

            raise RuntimeErrorException(
                "Invalid program structure."
            )

        if ast.get("type") != "Program":

            raise RuntimeErrorException(
                "Expected a Program AST."
            )

        for statement in ast.get("body", []):

            self.execute_statement(statement)

        return {
            "success": True,
            "output": self.output,
            "variables": [
                {
                    "name": name,
                    "value": variable["value"],
                    "data_type": variable["data_type"],
                    "initialized": variable["initialized"]
                }
                for name, variable in self.variables.items()
            ]
        }

    # --------------------------------
    # Statement Execution
    # --------------------------------

    def execute_statement(self, statement):

        statement_type = statement.get("type")

        if statement_type == "Declaration":

            self.execute_declaration(statement)

        elif statement_type == "Assignment":

            self.execute_assignment(statement)

        elif statement_type in ("Print", "PrintStatement"):

            self.execute_print(statement)

        elif statement_type == "IfStatement":

            self.execute_if(statement)

        else:

            raise RuntimeErrorException(
                f"Unsupported statement: {statement_type}"
            )

    # --------------------------------
    # Declaration
    # --------------------------------

    def execute_declaration(self, statement):

        name = statement.get("identifier")
        data_type = statement.get("data_type")
        initializer = statement.get("initializer")

        if name in self.variables:

            raise RuntimeErrorException(
                f"Variable '{name}' is already declared."
            )

        self.variables[name] = {
            "data_type": data_type,
            "value": None,
            "initialized": False
        }

        if initializer is not None:

            value = self.evaluate_expression(initializer)

            self.variables[name]["value"] = value
            self.variables[name]["initialized"] = True

    # --------------------------------
    # Assignment
    # --------------------------------

    def execute_assignment(self, statement):

        name = statement.get("identifier")

        if name not in self.variables:

            raise RuntimeErrorException(
                f"Variable '{name}' is not declared."
            )

        value = self.evaluate_expression(
            statement.get("expression")
        )

        variable_type = self.variables[name]["data_type"]

        if variable_type == "int":

            if isinstance(value, float):

                raise RuntimeErrorException(
                    f"Cannot assign a float value to int variable '{name}'."
                )

        self.variables[name]["value"] = value
        self.variables[name]["initialized"] = True

    # --------------------------------
    # Print
    # --------------------------------

    def execute_print(self, statement):

        expression = (
            statement.get("expression")
            or statement.get("value")
        )

        value = self.evaluate_expression(expression)

        self.output.append(
            self.format_value(value)
        )

    # --------------------------------
    # If / Else Execution
    # --------------------------------

    def execute_if(self, statement):

        condition = statement.get("condition")

        result = self.evaluate_condition(condition)

        if result:

            for child_statement in statement.get("then_body", []):

                self.execute_statement(child_statement)

        else:

            for child_statement in statement.get("else_body", []):

                self.execute_statement(child_statement)

    # --------------------------------
    # Evaluate Condition
    # --------------------------------

    def evaluate_condition(self, condition):

        if not isinstance(condition, dict):

            raise RuntimeErrorException(
                "Invalid conditional expression."
            )

        left = self.evaluate_expression(
            condition.get("left")
        )

        right = self.evaluate_expression(
            condition.get("right")
        )

        operator = condition.get("operator")

        if operator == ">":
            return left > right

        if operator == "<":
            return left < right

        if operator == ">=":
            return left >= right

        if operator == "<=":
            return left <= right

        if operator == "==":
            return left == right

        if operator == "!=":
            return left != right

        raise RuntimeErrorException(
            f"Unsupported relational operator: {operator}"
        )

    # --------------------------------
    # Expression Evaluation
    # --------------------------------

    def evaluate_expression(self, expression):

        if not isinstance(expression, dict):

            raise RuntimeErrorException(
                "Invalid expression."
            )

        expression_type = expression.get("type")

        # Number

        if expression_type == "Number":

            return self.evaluate_number(
                expression.get("value")
            )

        # String

        if expression_type == "String":

            return expression.get("value", "")

        # Identifier

        if expression_type == "Identifier":

            return self.evaluate_identifier(
                expression.get("name")
            )

        # Binary Expression

        if expression_type == "BinaryExpression":

            return self.evaluate_binary_expression(
                expression
            )

        # Unary Expression

        if expression_type == "UnaryExpression":

            return self.evaluate_unary_expression(
                expression
            )

        raise RuntimeErrorException(
            f"Unsupported expression: {expression_type}"
        )

    # --------------------------------
    # Number
    # --------------------------------

    def evaluate_number(self, value):

        try:

            value = str(value)

            if "." in value:
                return float(value)

            return int(value)

        except (ValueError, TypeError):

            raise RuntimeErrorException(
                f"Invalid numeric value: {value}"
            )

    # --------------------------------
    # Identifier
    # --------------------------------

    def evaluate_identifier(self, name):

        if name not in self.variables:

            raise RuntimeErrorException(
                f"Variable '{name}' is not declared."
            )

        variable = self.variables[name]

        if not variable["initialized"]:

            raise RuntimeErrorException(
                f"Variable '{name}' is used before initialization."
            )

        return variable["value"]

    # --------------------------------
    # Binary Expression
    # --------------------------------

    def evaluate_binary_expression(self, expression):

        operator = expression.get("operator")

        left = self.evaluate_expression(
            expression.get("left")
        )

        right = self.evaluate_expression(
            expression.get("right")
        )

        if operator == "+":
            return left + right

        if operator == "-":
            return left - right

        if operator == "*":
            return left * right

        if operator == "/":

            if right == 0:

                raise RuntimeErrorException(
                    "Division by zero is not allowed."
                )

            return left / right

        raise RuntimeErrorException(
            f"Unsupported operator: {operator}"
        )

    # --------------------------------
    # Unary Expression
    # --------------------------------

    def evaluate_unary_expression(self, expression):

        operator = expression.get("operator")

        operand = (
            expression.get("operand")
            or expression.get("expression")
        )

        value = self.evaluate_expression(operand)

        if operator == "+":
            return +value

        if operator == "-":
            return -value

        raise RuntimeErrorException(
            f"Unsupported unary operator: {operator}"
        )

    # --------------------------------
    # Format Output
    # --------------------------------

    @staticmethod
    def format_value(value):

        if isinstance(value, float):

            if value.is_integer():
                return str(int(value))

            return str(value)

        return str(value)


# --------------------------------
# Public API
# --------------------------------

def execute(source_code):

    # Stage 1: Lexical validation

    lexical_result = lexical_analyze(source_code)

    if not lexical_result.get("success"):

        return {
            "success": False,
            "failed_stage": "LEXICAL",
            "errors": lexical_result.get("errors", [])
        }

    # Stage 2: Syntax validation

    syntax_result = syntax_analyze(source_code)

    if not syntax_result.get("success"):

        return {
            "success": False,
            "failed_stage": "SYNTAX",
            "errors": syntax_result.get("errors", [])
        }

    # Stage 3: Semantic validation

    semantic_result = semantic_analyze(source_code)

    if not semantic_result.get("success"):

        return {
            "success": False,
            "failed_stage": "SEMANTIC",
            "errors": semantic_result.get("errors", [])
        }

    # Stage 4: Execute validated AST

    try:

        interpreter = Interpreter()

        result = interpreter.execute(
            syntax_result["ast"]
        )

        return {
            "success": True,
            "failed_stage": None,
            "output": result["output"],
            "variables": result["variables"],
            "message": "Program executed successfully."
        }

    except RuntimeErrorException as error:

        return {
            "success": False,
            "failed_stage": "RUNTIME",
            "errors": [str(error)]
        }

    except Exception as error:

        return {
            "success": False,
            "failed_stage": "RUNTIME",
            "errors": [
                f"Unexpected runtime error: {str(error)}"
            ]
        }