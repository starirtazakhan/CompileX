// Emerald Terminal theme for the Monaco code editor.
// Use with: beforeMount={defineEmeraldTheme} and theme="emerald-terminal"
export function defineEmeraldTheme(monaco) {
  monaco.editor.defineTheme("emerald-terminal", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "5f8a76", fontStyle: "italic" },
      { token: "keyword", foreground: "34d399", fontStyle: "bold" },
      { token: "type", foreground: "6ee7b7" },
      { token: "number", foreground: "fbbf24" },
      { token: "string", foreground: "a7f3d0" },
      { token: "identifier", foreground: "e6f2ec" },
      { token: "delimiter", foreground: "8fb3a0" },
      { token: "operator", foreground: "8fb3a0" }
    ],
    colors: {
      "editor.background": "#0f1f18",
      "editor.foreground": "#e6f2ec",
      "editorLineNumber.foreground": "#3d6b57",
      "editorLineNumber.activeForeground": "#34d399",
      "editor.lineHighlightBackground": "#16291f",
      "editor.selectionBackground": "#1d4d38",
      "editor.inactiveSelectionBackground": "#173a2b",
      "editorCursor.foreground": "#34d399",
      "editorIndentGuide.background1": "#1d3a2d",
      "editorIndentGuide.activeBackground1": "#2a5240",
      "editorWidget.background": "#0b1812",
      "editorSuggestWidget.background": "#0b1812",
      "editorSuggestWidget.border": "#1d3a2d",
      "scrollbarSlider.background": "#1d3a2d88",
      "scrollbarSlider.hoverBackground": "#2a524099"
    }
  });
}
