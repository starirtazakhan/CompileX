import re


KEYWORDS = {
    "define": "DEFINE",
    "whole": "TYPE_WHOLE",
    "decimal": "TYPE_DECIMAL",
    "text": "TYPE_TEXT",
    "logic": "TYPE_LOGIC",
    "display": "DISPLAY",
    "check": "CHECK",
    "otherwise": "OTHERWISE",
    "repeat": "REPEAT",
    "finish": "FINISH",
    "true": "BOOLEAN",
    "false": "BOOLEAN",
}

TOKEN_SPECIFICATION = [
    ("WHITESPACE", r"[ \t]+"),
    ("NEWLINE", r"\n"),

    # Comments
    ("COMMENT", r"//[^\n]*"),

    # Multi-character operators must come before shorter operators.
    ("MULTIPLY", r"><>"),
    ("EQUAL", r"==="),
    ("ASSIGN", r"<-"),
    ("ADD", r"><"),
    ("SUBTRACT", r"<>"),
    ("DIVIDE", r"</>"),
    ("GREATER", r">>"),
    ("LESS", r"<<"),

    # Punctuation
    ("LPAREN", r"\("),
    ("RPAREN", r"\)"),
    ("LBRACE", r"\{"),
    ("RBRACE", r"\}"),
    ("SEMICOLON", r";"),
    ("COMMA", r","),

    # Literals
    ("FLOAT", r"\d+\.\d+"),
    ("INTEGER", r"\d+"),
    ("STRING", r'"([^"\\]|\\.)*"'),

    # Identifiers and keywords
    ("IDENTIFIER", r"[a-zA-Z_][a-zA-Z0-9_]*"),

    # Invalid characters
    ("MISMATCH", r"."),
]


class Lexer:

    def __init__(self, source_code):
        self.source_code = source_code
        self.tokens = []
        self.errors = []

    def tokenize(self):

        token_regex = "|".join(
            f"(?P<{name}>{pattern})"
            for name, pattern in TOKEN_SPECIFICATION
        )

        line = 1
        column = 1

        for match in re.finditer(token_regex, self.source_code):

            kind = match.lastgroup
            value = match.group()

            if kind == "WHITESPACE":
                column += len(value)
                continue

            if kind == "NEWLINE":
                line += 1
                column = 1
                continue

            if kind == "COMMENT":
                column += len(value)
                continue

            if kind == "MISMATCH":
                self.errors.append(
                    f"Unexpected character '{value}' at line {line}, column {column}"
                )
                column += len(value)
                continue

            if kind == "IDENTIFIER" and value in KEYWORDS:
                kind = KEYWORDS[value]

            self.tokens.append({
                "lexeme": value,
                "token": kind,
                "line": line,
                "column": column
            })

            column += len(value)

        self.tokens.append({
            "lexeme": "EOF",
            "token": "EOF",
            "line": line,
            "column": column
        })

        return {
            "success": len(self.errors) == 0,
            "tokens": self.tokens,
            "errors": self.errors
        }


def analyze(source_code):
    lexer = Lexer(source_code)
    return lexer.tokenize()