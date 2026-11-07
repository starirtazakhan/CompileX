from engines.lexical.lexer import analyze as lexical_analyze


class ParseError(Exception):

    def __init__(self, message, line, column):

        self.message = message
        self.line = line
        self.column = column

        super().__init__(message)


class Parser:

    def __init__(self, tokens, source_code=""):

        self.tokens = tokens
        self.source_code = source_code

        self.position = 0

        self.current_token = (
            self.tokens[0] if self.tokens else None
        )

    # --------------------------------
    # Token Management
    # --------------------------------

    def advance(self):

        self.position += 1

        if self.position < len(self.tokens):
            self.current_token = self.tokens[self.position]
        else:
            self.current_token = None

    def check(self, lexeme):

        return (
            self.current_token is not None
            and self.current_token["lexeme"] == lexeme
        )

    def match(self, lexeme):

        if self.check(lexeme):
            self.advance()
            return True

        return False

    def expect(self, lexeme, message):

        if self.check(lexeme):

            token = self.current_token
            self.advance()

            return token

        self.raise_error(message)

    def raise_error(self, message):

        if self.current_token is not None:

            line = self.current_token["line"]
            column = self.current_token["column"]

        elif self.tokens:

            last_token = self.tokens[-1]

            line = last_token["line"]
            column = (
                last_token["column"]
                + len(last_token["lexeme"])
            )

        else:

            line = 1
            column = 1

        raise ParseError(message, line, column)

    # --------------------------------
    # Program
    # --------------------------------

    def parse(self):

        statements = []

        while self.current_token is not None:

            statement = self.parse_statement()

            statements.append(statement)

        return {
            "type": "Program",
            "body": statements
        }

    # --------------------------------
    # Statement Selection
    # --------------------------------

    def parse_statement(self):

        if self.check("int") or self.check("float"):

            return self.parse_declaration()

        elif self.check("print"):

            return self.parse_print()

        elif self.check("if"):

            return self.parse_if()

        elif (
            self.current_token is not None
            and self.current_token["token"] == "IDENTIFIER"
        ):

            return self.parse_assignment()

        else:

            self.raise_error(
                "Expected a declaration, assignment, print, or if statement."
            )

    # --------------------------------
    # Declaration
    # --------------------------------

    def parse_declaration(self):

        type_token = self.current_token

        data_type = type_token["lexeme"]

        self.advance()

        identifier = self.expect_identifier()

        initializer = None

        if self.match("="):

            initializer = self.parse_expression()

        self.expect(
            ";",
            "Expected ';' after declaration."
        )

        return {
            "type": "Declaration",
            "data_type": data_type,
            "identifier": identifier["lexeme"],
            "initializer": initializer
        }

    # --------------------------------
    # Assignment
    # --------------------------------

    def parse_assignment(self):

        identifier = self.expect_identifier()

        self.expect(
            "=",
            "Expected '=' in assignment."
        )

        expression = self.parse_expression()

        self.expect(
            ";",
            "Expected ';' after assignment."
        )

        return {
            "type": "Assignment",
            "identifier": identifier["lexeme"],
            "expression": expression
        }

    # --------------------------------
    # Print Statement
    # --------------------------------

    def parse_print(self):

        self.advance()

        self.expect(
            "(",
            "Expected '(' after print."
        )

        expression = self.parse_expression()

        self.expect(
            ")",
            "Expected ')' after print expression."
        )

        self.expect(
            ";",
            "Expected ';' after print statement."
        )

        return {
            "type": "Print",
            "expression": expression
        }

    # --------------------------------
    # If / Else Statement
    # --------------------------------

    def parse_if(self):

        self.expect(
            "if",
            "Expected 'if'."
        )

        self.expect(
            "(",
            "Expected '(' after if."
        )

        condition = self.parse_condition()

        self.expect(
            ")",
            "Expected ')' after condition."
        )

        then_body = self.parse_block()

        else_body = []

        if self.match("else"):

            else_body = self.parse_block()

        return {
            "type": "IfStatement",
            "condition": condition,
            "then_body": then_body,
            "else_body": else_body
        }

    # --------------------------------
    # Condition
    # --------------------------------

    def parse_condition(self):

        left = self.parse_expression()

        relational_operators = (
            ">", "<", ">=", "<=", "==", "!="
        )

        if (
            self.current_token is None
            or self.current_token["lexeme"]
            not in relational_operators
        ):

            self.raise_error(
                "Expected a relational operator in condition."
            )

        operator = self.current_token["lexeme"]

        self.advance()

        right = self.parse_expression()

        return {
            "type": "Condition",
            "operator": operator,
            "left": left,
            "right": right
        }

    # --------------------------------
    # Block
    # --------------------------------

    def parse_block(self):

        self.expect(
            "{",
            "Expected '{' to start block."
        )

        statements = []

        while (
            self.current_token is not None
            and not self.check("}")
        ):

            statements.append(
                self.parse_statement()
            )

        self.expect(
            "}",
            "Expected '}' to close block."
        )

        return statements

    # --------------------------------
    # Expression
    # --------------------------------

    def parse_expression(self):

        return self.parse_additive()

    def parse_additive(self):

        node = self.parse_multiplicative()

        while (
            self.current_token is not None
            and (
                self.check("+")
                or self.check("-")
            )
        ):

            operator = self.current_token["lexeme"]

            self.advance()

            right = self.parse_multiplicative()

            node = {
                "type": "BinaryExpression",
                "operator": operator,
                "left": node,
                "right": right
            }

        return node

    def parse_multiplicative(self):

        node = self.parse_unary()

        while (
            self.current_token is not None
            and (
                self.check("*")
                or self.check("/")
            )
        ):

            operator = self.current_token["lexeme"]

            self.advance()

            right = self.parse_unary()

            node = {
                "type": "BinaryExpression",
                "operator": operator,
                "left": node,
                "right": right
            }

        return node

    # --------------------------------
    # Unary Expressions
    # --------------------------------

    def parse_unary(self):

        if self.check("+") or self.check("-"):

            operator = self.current_token["lexeme"]

            self.advance()

            operand = self.parse_unary()

            return {
                "type": "UnaryExpression",
                "operator": operator,
                "operand": operand
            }

        return self.parse_primary()

    # --------------------------------
    # Primary Expressions
    # --------------------------------

    def parse_primary(self):

        if self.current_token is None:

            self.raise_error(
                "Expected an expression."
            )

        token = self.current_token

        if token["token"] in ("INTEGER", "FLOAT"):

            self.advance()

            return {
                "type": "Number",
                "value": token["lexeme"]
            }

        elif token["token"] == "STRING":

            self.advance()

            return {
                "type": "String",
                "value": token["lexeme"][1:-1]
            }

        elif token["token"] == "IDENTIFIER":

            self.advance()

            return {
                "type": "Identifier",
                "name": token["lexeme"]
            }

        elif self.match("("):

            expression = self.parse_expression()

            self.expect(
                ")",
                "Expected ')' after expression."
            )

            return expression

        else:

            self.raise_error(
                "Expected an identifier, number, string, or parenthesized expression."
            )

    # --------------------------------
    # Identifier Validation
    # --------------------------------

    def expect_identifier(self):

        if (
            self.current_token is not None
            and self.current_token["token"] == "IDENTIFIER"
        ):

            token = self.current_token

            self.advance()

            return token

        self.raise_error("Expected an identifier.")


# --------------------------------
# Public API
# --------------------------------

def analyze(source_code):

    lexical_result = lexical_analyze(source_code)

    if not lexical_result["success"]:

        return {
            "success": False,
            "ast": None,
            "errors": [],
            "lexical_errors": lexical_result["errors"]
        }

    parser = Parser(
        lexical_result["tokens"],
        source_code
    )

    try:

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
            "errors": [{
                "message": error.message,
                "line": error.line,
                "column": error.column
            }],
            "lexical_errors": []
        }