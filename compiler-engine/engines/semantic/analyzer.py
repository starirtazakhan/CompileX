from engines.lexical.lexer import analyze as lexical_analyze
from engines.syntax.parser import analyze as syntax_analyze


class SemanticAnalyzer:

    def __init__(self, ast):

        self.ast = ast
        self.symbol_table = {}
        self.errors = []

    def analyze(self):

        for statement in self.ast.get("body", []):
            self.analyze_statement(statement)

        return self.build_result()

    def build_result(self):

        return {
            "success": len(self.errors) == 0,
            "symbol_table": self.symbol_table,
            "symbolTable": self.symbol_table,
            "errors": self.errors,
            "stage": "semantic"
        }

    def analyze_statement(self, statement):

        statement_type = statement["type"]

        if statement_type == "Declaration":
            self.analyze_declaration(statement)

        elif statement_type == "Assignment":
            self.analyze_assignment(statement)

        elif statement_type == "Print":
            self.analyze_expression(statement["expression"])

        elif statement_type == "IfStatement":

            self.analyze_condition(statement["condition"])

            for item in statement["consequent"]:
                self.analyze_statement(item)

            for item in statement["alternate"]:
                self.analyze_statement(item)

        elif statement_type == "RepeatStatement":

            self.analyze_condition(statement["condition"])

            for item in statement["body"]:
                self.analyze_statement(item)

    def analyze_declaration(self, statement):

        name = statement["name"]
        data_type = statement["data_type"]

        if name in self.symbol_table:

            self.errors.append(
                f"Variable '{name}' is already declared."
            )

            return

        self.symbol_table[name] = {
            "type": data_type,
            "initialized": False,
            "value": None
        }

        if statement["value"] is not None:

            value_type = self.analyze_expression(
                statement["value"]
            )

            if self.is_compatible(data_type, value_type):

                self.symbol_table[name]["initialized"] = True

                if statement["value"]["type"] in (
                    "Number",
                    "String",
                    "Boolean"
                ):
                    self.symbol_table[name]["value"] = (
                        statement["value"]["value"]
                    )

            else:

                self.errors.append(
                    f"Cannot assign {value_type} to "
                    f"{data_type} variable '{name}'."
                )

    def analyze_assignment(self, statement):

        name = statement["name"]

        if name not in self.symbol_table:

            self.errors.append(
                f"Variable '{name}' is not declared."
            )

            return

        value_type = self.analyze_expression(
            statement["value"]
        )

        variable_type = self.symbol_table[name]["type"]

        if self.is_compatible(variable_type, value_type):

            self.symbol_table[name]["initialized"] = True

            if statement["value"]["type"] in (
                "Number",
                "String",
                "Boolean"
            ):
                self.symbol_table[name]["value"] = (
                    statement["value"]["value"]
                )
            else:
                self.symbol_table[name]["value"] = None

        else:

            self.errors.append(
                f"Cannot assign {value_type} to "
                f"{variable_type} variable '{name}'."
            )

    def analyze_expression(self, expression):

        expression_type = expression["type"]

        if expression_type == "Number":
            return expression["data_type"]

        if expression_type == "String":
            return "text"

        if expression_type == "Boolean":
            return "logic"

        if expression_type == "Identifier":

            name = expression["name"]

            if name not in self.symbol_table:

                self.errors.append(
                    f"Variable '{name}' is not declared."
                )

                return "unknown"

            if not self.symbol_table[name]["initialized"]:

                self.errors.append(
                    f"Variable '{name}' is used before initialization."
                )

            return self.symbol_table[name]["type"]

        if expression_type == "UnaryExpression":

            operand_type = self.analyze_expression(
                expression["operand"]
            )

            if operand_type not in ("whole", "decimal"):

                self.errors.append(
                    "Unary minus requires a numeric operand."
                )

                return "unknown"

            return operand_type

        if expression_type == "BinaryExpression":

            left_type = self.analyze_expression(
                expression["left"]
            )

            right_type = self.analyze_expression(
                expression["right"]
            )

            if (
                left_type not in ("whole", "decimal")
                or right_type not in ("whole", "decimal")
            ):

                self.errors.append(
                    "Arithmetic operators require numeric operands."
                )

                return "unknown"

            if expression["operator"] == "</>":
                return "decimal"

            if (
                left_type == "decimal"
                or right_type == "decimal"
            ):
                return "decimal"

            return "whole"

        if expression_type == "Condition":

            self.analyze_condition(expression)

            return "logic"

        return "unknown"

    def analyze_condition(self, condition):

        left_type = self.analyze_expression(
            condition["left"]
        )

        right_type = self.analyze_expression(
            condition["right"]
        )

        operator = condition["operator"]

        if (
            left_type in ("whole", "decimal")
            and right_type in ("whole", "decimal")
        ):
            return

        if left_type != right_type:

            self.errors.append(
                f"Cannot compare incompatible types "
                f"'{left_type}' and '{right_type}'."
            )

            return

        if operator in (">>", "<<"):

            if left_type not in ("whole", "decimal"):

                self.errors.append(
                    "Greater-than and less-than operators "
                    "require numeric operands."
                )

    @staticmethod
    def is_compatible(target_type, value_type):

        if target_type == value_type:
            return True

        # Allow whole numbers to be assigned to decimal variables.
        if target_type == "decimal" and value_type == "whole":
            return True

        return False


def analyze(source_code):

    lexical_result = lexical_analyze(source_code)

    if not lexical_result["success"]:

        return {
            "success": False,
            "symbol_table": {},
            "symbolTable": {},
            "errors": lexical_result["errors"],
            "stage": "semantic"
        }

    syntax_result = syntax_analyze(source_code)

    if not syntax_result["success"]:

        return {
            "success": False,
            "symbol_table": {},
            "symbolTable": {},
            "errors": syntax_result["errors"],
            "stage": "semantic"
        }

    analyzer = SemanticAnalyzer(
        syntax_result["ast"]
    )

    return analyzer.analyze()