from engines.lexical.lexer import analyze as lexical_analyze
from engines.syntax.parser import analyze as syntax_analyze


class SemanticAnalyzer:

    def __init__(self, ast):

        self.ast = ast
        self.symbol_table = {}
        self.errors = []

    # --------------------------------
    # Main Analysis
    # --------------------------------

    def analyze(self):

        self.analyze_statements(
            self.ast["body"]
        )

        return {
            "success": len(self.errors) == 0,
            "symbol_table": list(self.symbol_table.values()),
            "errors": self.errors
        }

    # --------------------------------
    # Statement Analysis
    # --------------------------------

    def analyze_statements(self, statements):

        for statement in statements:

            statement_type = statement["type"]

            if statement_type == "Declaration":

                self.analyze_declaration(statement)

            elif statement_type == "Assignment":

                self.analyze_assignment(statement)

            elif statement_type == "Print":

                self.analyze_print(statement)

            elif statement_type == "IfStatement":

                self.analyze_if(statement)

    # --------------------------------
    # Variable Declaration
    # --------------------------------

    def analyze_declaration(self, statement):

        name = statement["identifier"]
        data_type = statement["data_type"]

        if name in self.symbol_table:

            self.add_error(
                f"Variable '{name}' is already declared."
            )

            return

        self.symbol_table[name] = {
            "name": name,
            "data_type": data_type,
            "initialized": False
        }

        if statement["initializer"] is not None:

            expression_type = self.evaluate_expression(
                statement["initializer"]
            )

            if self.is_compatible(data_type, expression_type):

                self.symbol_table[name]["initialized"] = True

            else:

                self.add_error(
                    f"Cannot initialize {data_type.upper()} "
                    f"variable '{name}' with "
                    f"{expression_type.upper()} value."
                )

    # --------------------------------
    # Assignment
    # --------------------------------

    def analyze_assignment(self, statement):

        name = statement["identifier"]

        if name not in self.symbol_table:

            self.add_error(
                f"Variable '{name}' has not been declared."
            )

            return

        expression_type = self.evaluate_expression(
            statement["expression"]
        )

        variable_type = self.symbol_table[name]["data_type"]

        if self.is_compatible(variable_type, expression_type):

            self.symbol_table[name]["initialized"] = True

        else:

            self.add_error(
                f"Cannot assign {expression_type.upper()} "
                f"to {variable_type.upper()} "
                f"variable '{name}'."
            )

    # --------------------------------
    # Print Statement
    # --------------------------------

    def analyze_print(self, statement):

        expression = statement["expression"]

        self.evaluate_expression(expression)

    # --------------------------------
    # If Statement
    # --------------------------------

    def analyze_if(self, statement):

        condition = statement["condition"]

        left_type = self.evaluate_expression(
            condition["left"]
        )

        right_type = self.evaluate_expression(
            condition["right"]
        )

        if (
            left_type not in ("int", "float")
            or right_type not in ("int", "float")
        ):

            self.add_error(
                "Conditional expressions must compare numeric values."
            )

        # Analyze IF body

        self.analyze_statements(
            statement["then_body"]
        )

        # Analyze ELSE body

        self.analyze_statements(
            statement["else_body"]
        )

    # --------------------------------
    # Expression Evaluation
    # --------------------------------

    def evaluate_expression(self, expression):

        expression_type = expression["type"]

        # Number

        if expression_type == "Number":

            if "." in expression["value"]:
                return "float"

            return "int"

        # String

        elif expression_type == "String":

            return "string"

        # Identifier

        elif expression_type == "Identifier":

            name = expression["name"]

            if name not in self.symbol_table:

                self.add_error(
                    f"Variable '{name}' has not been declared."
                )

                return "unknown"

            return self.symbol_table[name]["data_type"]

        # Unary Expression

        elif expression_type == "UnaryExpression":

            operand_type = self.evaluate_expression(
                expression["operand"]
            )

            if operand_type not in ("int", "float", "unknown"):

                self.add_error(
                    "Unary operators require numeric operands."
                )

                return "unknown"

            return operand_type

        # Binary Expression

        elif expression_type == "BinaryExpression":

            left_type = self.evaluate_expression(
                expression["left"]
            )

            right_type = self.evaluate_expression(
                expression["right"]
            )

            if "unknown" in (left_type, right_type):
                return "unknown"

            if (
                left_type not in ("int", "float")
                or right_type not in ("int", "float")
            ):

                self.add_error(
                    "Arithmetic expressions require numeric operands."
                )

                return "unknown"

            if left_type == "float" or right_type == "float":

                return "float"

            return "int"

        return "unknown"

    # --------------------------------
    # Type Compatibility
    # --------------------------------

    def is_compatible(self, target_type, expression_type):

        if expression_type == "unknown":
            return False

        # int can be promoted to float

        if target_type == "float" and expression_type == "int":
            return True

        return target_type == expression_type

    # --------------------------------
    # Error Handling
    # --------------------------------

    def add_error(self, message):

        self.errors.append({
            "message": message
        })


# --------------------------------
# Public API
# --------------------------------

def analyze(source_code):

    lexical_result = lexical_analyze(source_code)

    if not lexical_result["success"]:

        return {
            "success": False,
            "symbol_table": [],
            "errors": lexical_result["errors"],
            "stage": "LEXICAL"
        }

    syntax_result = syntax_analyze(source_code)

    if not syntax_result["success"]:

        return {
            "success": False,
            "symbol_table": [],
            "errors": syntax_result["errors"],
            "stage": "SYNTAX"
        }

    analyzer = SemanticAnalyzer(
        syntax_result["ast"]
    )

    result = analyzer.analyze()

    result["stage"] = "SEMANTIC"

    return result