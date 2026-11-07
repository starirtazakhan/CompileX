import re


class Lexer:

    def __init__(self, source_code):
        self.source_code = source_code
        self.tokens = []
        self.errors = []

        self.keywords = {
            "int": "KEYWORD",
            "float": "KEYWORD",
            "print": "KEYWORD",
            "if": "KEYWORD",
            "else": "KEYWORD"
        }

        self.token_patterns = [
            # String literals
            ("STRING", r'"(?:\\.|[^"\\])*"'),

            ("FLOAT", r"\d+\.\d+"),
            ("INTEGER", r"\d+"),
            ("IDENTIFIER", r"[a-zA-Z_][a-zA-Z0-9_]*"),

            # Relational operators
            ("RELATIONAL_OPERATOR", r">=|<=|==|!=|>|<"),

            ("ASSIGNMENT_OPERATOR", r"="),
            ("ARITHMETIC_OPERATOR", r"[+\-*/]"),

            ("SEMICOLON", r";"),
            ("LEFT_PAREN", r"\("),
            ("RIGHT_PAREN", r"\)"),
            ("LEFT_BRACE", r"\{"),
            ("RIGHT_BRACE", r"\}")
        ]

    def tokenize(self):

        position = 0
        line = 1
        column = 1

        source_length = len(self.source_code)

        while position < source_length:

            current_char = self.source_code[position]

            # Ignore whitespace
            if current_char.isspace():

                if current_char == "\n":
                    line += 1
                    column = 1
                else:
                    column += 1

                position += 1
                continue

            # Ignore single-line comments
            if self.source_code[position:position + 2] == "//":

                while (
                    position < source_length
                    and self.source_code[position] != "\n"
                ):
                    position += 1
                    column += 1

                continue

            matched = False

            for token_type, pattern in self.token_patterns:

                match = re.match(
                    pattern,
                    self.source_code[position:]
                )

                if match:

                    lexeme = match.group(0)

                    # Convert identifiers into keywords
                    if (
                        token_type == "IDENTIFIER"
                        and lexeme in self.keywords
                    ):
                        token_type = self.keywords[lexeme]

                    self.tokens.append({
                        "lexeme": lexeme,
                        "token": token_type,
                        "line": line,
                        "column": column
                    })

                    position += len(lexeme)
                    column += len(lexeme)

                    matched = True
                    break

            # Invalid character
            if not matched:

                self.errors.append({
                    "message": f"Invalid character '{current_char}'",
                    "line": line,
                    "column": column
                })

                position += 1
                column += 1

        return {
            "success": len(self.errors) == 0,
            "tokens": self.tokens,
            "errors": self.errors
        }


def analyze(source_code):

    lexer = Lexer(source_code)

    return lexer.tokenize()