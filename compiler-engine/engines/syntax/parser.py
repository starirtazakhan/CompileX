from engines.lexical.lexer import analyze as lexical_analyze


class ParseError(Exception):
    pass


class Parser:

    def __init__(self, tokens, source_code=""):
        self.tokens = tokens
        self.source_code = source_code
        self.position = 0

    def current(self):
        return self.tokens[self.position]

    def check(self, token_type):
        return self.current()["token"] == token_type

    def advance(self):
        token = self.current()

        if not self.check("EOF"):
            self.position += 1

        return token

    def expect(self, token_type):
        if not self.check(token_type):
            token = self.current()

            raise ParseError(
                f"Expected {token_type}, found '{token['lexeme']}' "
                f"at line {token['line']}"
            )

        return self.advance()

    def parse(self):

        body = []

        while not self.check("EOF"):
            body.append(self.parse_statement())

        return {
            "type": "Program",
            "body": body
        }

    def parse_statement(self):

        if self.check("DEFINE"):
            return self.parse_declaration()

        if self.check("IDENTIFIER"):
            return self.parse_assignment()

        if self.check("DISPLAY"):
            return self.parse_print()

        if self.check("CHECK"):
            return self.parse_if()

        if self.check("REPEAT"):
            return self.parse_loop()

        raise ParseError(
            f"Unexpected token '{self.current()['lexeme']}' "
            f"at line {self.current()['line']}"
        )

    def parse_declaration(self):

        self.expect("DEFINE")

        type_token = self.advance()

        type_mapping = {
            "TYPE_WHOLE": "whole",
            "TYPE_DECIMAL": "decimal",
            "TYPE_TEXT": "text",
            "TYPE_LOGIC": "logic"
        }

        if type_token["token"] not in type_mapping:
            raise ParseError(
                f"Invalid data type '{type_token['lexeme']}'"
            )

        variable_type = type_mapping[type_token["token"]]

        name = self.expect("IDENTIFIER")["lexeme"]

        value = None

        if self.check("ASSIGN"):
            self.advance()
            value = self.parse_expression()

        self.expect("SEMICOLON")

        return {
            "type": "Declaration",
            "data_type": variable_type,
            "name": name,
            "value": value
        }

    def parse_assignment(self):

        name = self.expect("IDENTIFIER")["lexeme"]

        self.expect("ASSIGN")

        value = self.parse_expression()

        self.expect("SEMICOLON")

        return {
            "type": "Assignment",
            "name": name,
            "value": value
        }

    def parse_print(self):

        self.expect("DISPLAY")
        self.expect("LPAREN")

        expression = self.parse_expression()

        self.expect("RPAREN")
        self.expect("SEMICOLON")

        return {
            "type": "Print",
            "expression": expression
        }

    def parse_if(self):

        self.expect("CHECK")
        self.expect("LPAREN")

        condition = self.parse_expression()

        self.expect("RPAREN")
        self.expect("LBRACE")

        consequent = []

        while not self.check("RBRACE"):
            if self.check("EOF"):
                raise ParseError("Missing closing brace in check statement")

            consequent.append(self.parse_statement())

        self.expect("RBRACE")

        alternate = []

        if self.check("OTHERWISE"):

            self.advance()
            self.expect("LBRACE")

            while not self.check("RBRACE"):
                if self.check("EOF"):
                    raise ParseError(
                        "Missing closing brace in otherwise statement"
                    )

                alternate.append(self.parse_statement())

            self.expect("RBRACE")

        return {
            "type": "IfStatement",
            "condition": condition,
            "consequent": consequent,
            "alternate": alternate
        }

    def parse_loop(self):

        self.expect("REPEAT")
        self.expect("LPAREN")

        condition = self.parse_expression()

        self.expect("RPAREN")
        self.expect("LBRACE")

        body = []

        while not self.check("RBRACE"):

            if self.check("EOF"):
                raise ParseError("Missing closing brace in repeat loop")

            body.append(self.parse_statement())

        self.expect("RBRACE")
        self.expect("FINISH")

        return {
            "type": "RepeatStatement",
            "condition": condition,
            "body": body
        }

    def parse_expression(self):
        return self.parse_comparison()

    def parse_comparison(self):

        expression = self.parse_additive()

        while self.check("GREATER") or self.check("LESS") or self.check("EQUAL"):

            operator = self.advance()["lexeme"]
            right = self.parse_additive()

            expression = {
                "type": "Condition",
                "operator": operator,
                "left": expression,
                "right": right
            }

        return expression

    def parse_additive(self):

        expression = self.parse_multiplicative()

        while self.check("ADD") or self.check("SUBTRACT"):

            operator = self.advance()["lexeme"]
            right = self.parse_multiplicative()

            expression = {
                "type": "BinaryExpression",
                "operator": operator,
                "left": expression,
                "right": right
            }

        return expression

    def parse_multiplicative(self):

        expression = self.parse_unary()

        while self.check("MULTIPLY") or self.check("DIVIDE"):

            operator = self.advance()["lexeme"]
            right = self.parse_unary()

            expression = {
                "type": "BinaryExpression",
                "operator": operator,
                "left": expression,
                "right": right
            }

        return expression

    def parse_unary(self):

        if self.check("SUBTRACT"):

            operator = self.advance()["lexeme"]

            return {
                "type": "UnaryExpression",
                "operator": operator,
                "operand": self.parse_unary()
            }

        return self.parse_primary()

    def parse_primary(self):

        if self.check("INTEGER"):

            value = int(self.advance()["lexeme"])

            return {
                "type": "Number",
                "value": value,
                "data_type": "whole"
            }

        if self.check("FLOAT"):

            value = float(self.advance()["lexeme"])

            return {
                "type": "Number",
                "value": value,
                "data_type": "decimal"
            }

        if self.check("STRING"):

            value = self.advance()["lexeme"]

            return {
                "type": "String",
                "value": value[1:-1]
            }

        if self.check("BOOLEAN"):

            value = self.advance()["lexeme"] == "true"

            return {
                "type": "Boolean",
                "value": value
            }

        if self.check("IDENTIFIER"):

            name = self.advance()["lexeme"]

            return {
                "type": "Identifier",
                "name": name
            }

        if self.check("LPAREN"):

            self.advance()

            expression = self.parse_expression()

            self.expect("RPAREN")

            return expression

        raise ParseError(
            f"Unexpected expression token '{self.current()['lexeme']}'"
        )


def analyze(source_code):

    lexical_result = lexical_analyze(source_code)

    if not lexical_result["success"]:
        return {
            "success": False,
            "ast": None,
            "errors": lexical_result["errors"],
            "lexical_errors": lexical_result["errors"]
        }

    try:

        parser = Parser(
            lexical_result["tokens"],
            source_code
        )

        ast = parser.parse()

        return {
            "success": True,
            "ast": ast,
            "errors": [],
            "lexical_errors": []
        }

    except ParseError as error:

        return {
            "success": False,
            "ast": None,
            "errors": [str(error)],
            "lexical_errors": []
        } 