import { useState } from "react";

import {
  CheckCircle2,
  XCircle,
  Terminal,
  Table2,
  Braces,
  Database,
  Code2,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Layers,
} from "lucide-react";

// Reusable collapsible section
function OutputSection({ title, icon: Icon, children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <button
        onClick={() => setExpanded((previous) => !previous)}
        className="flex w-full items-center justify-between border-b border-slate-800 p-4 text-left"
      >
        <div className="flex items-center gap-2 text-white">
          <Icon size={18} className="text-cyan-400" />
          <span className="text-sm font-semibold">{title}</span>
        </div>

        {expanded ? (
          <ChevronDown size={17} className="text-slate-400" />
        ) : (
          <ChevronRight size={17} className="text-slate-400" />
        )}
      </button>

      {expanded && <div className="p-4">{children}</div>}
    </div>
  );
}

// Stage status badge
function StageBadge({ success }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        success
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {success ? "Successful" : "Failed"}
    </span>
  );
}

// Lexical token table
function TokenTable({ tokens = [] }) {
  if (!tokens.length) {
    return (
      <p className="text-sm text-slate-500">
        No tokens generated.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-950 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Lexeme</th>
            <th className="px-4 py-3">Token Type</th>
            <th className="px-4 py-3">Line</th>
            <th className="px-4 py-3">Column</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800">
          {tokens.map((token, index) => (
            <tr key={`${token.line}-${token.column}-${index}`}>
              <td className="px-4 py-3 text-slate-500">
                {index + 1}
              </td>

              <td className="px-4 py-3 font-mono text-white">
                {token.lexeme}
              </td>

              <td className="px-4 py-3">
                <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400">
                  {token.token}
                </span>
              </td>

              <td className="px-4 py-3 text-slate-400">
                {token.line}
              </td>

              <td className="px-4 py-3 text-slate-400">
                {token.column}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Recursive AST visualization
function ASTNode({ node, depth = 0 }) {
  if (!node || typeof node !== "object") return null;

  const children = Object.entries(node).filter(
    ([, value]) =>
      value !== null && typeof value === "object"
  );

  const properties = Object.entries(node).filter(
    ([, value]) =>
      value === null || typeof value !== "object"
  );

  const nodeName = node.type || "Node";

  return (
    <div
      className="relative"
      style={{ marginLeft: depth === 0 ? 0 : 20 }}
    >
      <div className="my-2 rounded-lg border border-slate-700 bg-slate-950 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Braces size={15} className="text-purple-400" />

          <span className="text-sm font-semibold text-purple-300">
            {nodeName}
          </span>
        </div>

        {properties.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {properties.map(([key, value]) => (
              <span
                key={key}
                className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
              >
                <span className="text-slate-500">
                  {key}:{" "}
                </span>
                {String(value)}
              </span>
            ))}
          </div>
        )}
      </div>

      {children.map(([key, value]) => {
        const childNodes = Array.isArray(value)
          ? value
          : [value];

        return (
          <div key={key}>
            {childNodes.map((child, index) => (
              <div key={`${key}-${index}`}>
                <p className="ml-5 mt-2 text-xs font-medium uppercase text-slate-500">
                  {key}
                  {Array.isArray(value) ? ` ${index + 1}` : ""}
                </p>

                <ASTNode
                  node={child}
                  depth={depth + 1}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// Symbol table
function SymbolTable({ symbols = {} }) {

  // Convert backend object into an array for React rendering.
  const normalizedSymbols = Array.isArray(symbols)
    ? symbols
    : Object.entries(symbols || {}).map(
        ([name, details]) => ({
          name,
          data_type:
            details.type || details.data_type || "Unknown",
          initialized: Boolean(details.initialized),
          value: details.value,
        })
      );

  if (!normalizedSymbols.length) {
    return (
      <p className="text-sm text-slate-500">
        No symbols found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-950 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Variable</th>
            <th className="px-4 py-3">Data Type</th>
            <th className="px-4 py-3">Value</th>
            <th className="px-4 py-3">Initialization</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800">
          {normalizedSymbols.map((symbol, index) => (
            <tr key={`${symbol.name}-${index}`}>
              <td className="px-4 py-3 text-slate-500">
                {index + 1}
              </td>

              <td className="px-4 py-3 font-mono text-white">
                {symbol.name}
              </td>

              <td className="px-4 py-3 text-cyan-400">
                {symbol.data_type || symbol.type || "Unknown"}
              </td>

              <td className="px-4 py-3 font-mono text-slate-300">
                {symbol.value === null ||
                symbol.value === undefined
                  ? "-"
                  : String(symbol.value)}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-md px-2 py-1 text-xs ${
                    symbol.initialized
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {symbol.initialized
                    ? "Initialized"
                    : "Not Initialized"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Intermediate code display
function IntermediateCode({ code = [] }) {
  if (!code.length) {
    return (
      <p className="text-sm text-slate-500">
        No intermediate code generated.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {code.map((instruction, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-lg bg-slate-950 px-4 py-3"
        >
          <span className="w-6 text-xs text-slate-600">
            {index + 1}
          </span>

          <code className="font-mono text-sm text-emerald-400">
            {instruction}
          </code>
        </div>
      ))}
    </div>
  );
}

// Error display
function ErrorList({ errors = [] }) {
  if (!errors.length) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400">
        <CheckCircle2 size={16} />
        No errors found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {errors.map((error, index) => (
        <div
          key={index}
          className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
        >
          <AlertTriangle
            size={16}
            className="mt-0.5 shrink-0"
          />

          <span>
            {typeof error === "string"
              ? error
              : error.message || JSON.stringify(error)}
          </span>
        </div>
      ))}
    </div>
  );
}

// Individual stage output
function StageOutput({ stage, data }) {
  if (!data) return null;

  const stageConfig = {
    lexical: {
      title: "Lexical Analysis",
      icon: Table2,
    },
    syntax: {
      title: "Syntax Analysis",
      icon: Braces,
    },
    semantic: {
      title: "Semantic Analysis",
      icon: Database,
    },
    icg: {
      title: "Intermediate Code Generation",
      icon: Code2,
    },
  };

  const config = stageConfig[stage];

  if (!config) return null;

  return (
    <OutputSection
      title={config.title}
      icon={config.icon}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Stage Result
        </span>

        <StageBadge success={data.success} />
      </div>

      {/* Lexical Analysis */}
      {stage === "lexical" && (
        <>
          <TokenTable tokens={data.tokens || []} />

          <div className="mt-5">
            <h4 className="mb-3 text-sm font-semibold text-white">
              Lexical Errors
            </h4>

            <ErrorList errors={data.errors || []} />
          </div>
        </>
      )}

      {/* Syntax Analysis */}
      {stage === "syntax" && (
        <>
          <h4 className="mb-3 text-sm font-semibold text-white">
            Abstract Syntax Tree
          </h4>

          {data.ast ? (
            <div className="overflow-x-auto">
              <ASTNode node={data.ast} />
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              AST is not available.
            </p>
          )}

          <div className="mt-5">
            <h4 className="mb-3 text-sm font-semibold text-white">
              Syntax Errors
            </h4>

            <ErrorList
              errors={[
                ...(data.errors || []),
                ...(data.lexical_errors || []),
              ]}
            />
          </div>
        </>
      )}

      {/* Semantic Analysis */}
      {stage === "semantic" && (
        <>
          <h4 className="mb-3 text-sm font-semibold text-white">
            Symbol Table
          </h4>

          <SymbolTable
            symbols={
              data.symbol_table ??
              data.symbolTable ??
              {}
            }
          />

          <div className="mt-5">
            <h4 className="mb-3 text-sm font-semibold text-white">
              Semantic Errors
            </h4>

            <ErrorList errors={data.errors || []} />
          </div>
        </>
      )}

      {/* Intermediate Code Generation */}
      {stage === "icg" && (
        <>
          <h4 className="mb-3 text-sm font-semibold text-white">
            Three-Address Code
          </h4>

          <IntermediateCode
            code={data.intermediate_code || []}
          />

          <div className="mt-5">
            <h4 className="mb-3 text-sm font-semibold text-white">
              ICG Errors
            </h4>

            <ErrorList errors={data.errors || []} />
          </div>
        </>
      )}
    </OutputSection>
  );
}

// Main Output Panel
function OutputPanel({
  result,
  loading,
  error,
  activeStage,
  stageLabel,
}) {
  const [view, setView] = useState("structured");

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-cyan-400">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />

          <p className="text-sm">
            Processing {stageLabel || activeStage}...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
        <div className="mb-2 flex items-center gap-2 text-red-400">
          <XCircle size={18} />

          <span className="font-semibold">
            Compilation Error
          </span>
        </div>

        <pre className="whitespace-pre-wrap text-sm text-red-300">
          {error}
        </pre>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-slate-500">
        <Terminal size={38} className="mb-3" />

        <p className="text-sm">
          No output available.
        </p>

        <p className="mt-1 text-xs">
          Select a compiler stage or click Run All.
        </p>
      </div>
    );
  }

  const normalizedResult = result.result || result;

  const isRunAll =
    activeStage === "all" ||
    Boolean(
      normalizedResult.lexical ||
      normalizedResult.syntax ||
      normalizedResult.semantic ||
      normalizedResult.icg
    );

  const stageList = [
    "lexical",
    "syntax",
    "semantic",
    "icg",
  ];

  const stagesToDisplay = isRunAll
    ? stageList.filter(
        (stage) => normalizedResult[stage]
      )
    : stageList.includes(activeStage)
    ? [activeStage]
    : [];

  const successful =
    normalizedResult.success !== false;

  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* Overall Status */}
      <div
        className={`m-4 mb-2 flex items-center gap-2 rounded-lg border p-3 ${
          successful
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : "border-red-500/30 bg-red-500/10 text-red-400"
        }`}
      >
        {successful ? (
          <CheckCircle2 size={18} />
        ) : (
          <XCircle size={18} />
        )}

        <span className="text-sm font-semibold">
          {successful
            ? "Compilation Successful"
            : "Compilation Failed"}
        </span>
      </div>

      {/* View Switch */}
      <div className="flex gap-2 border-b border-slate-800 px-4 pb-3">
        <button
          onClick={() => setView("structured")}
          className={`rounded-lg px-3 py-2 text-xs font-medium ${
            view === "structured"
              ? "bg-cyan-500/15 text-cyan-400"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          Structured Output
        </button>

        <button
          onClick={() => setView("json")}
          className={`rounded-lg px-3 py-2 text-xs font-medium ${
            view === "json"
              ? "bg-cyan-500/15 text-cyan-400"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          Raw JSON
        </button>
      </div>

      {/* Output Content */}
      <div className="min-h-0 flex-1 space-y-4 overflow-auto p-4">

        {view === "structured" ? (
          <>
            {isRunAll && (
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-4">
                <Layers
                  size={18}
                  className="text-cyan-400"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Complete Compiler Pipeline
                  </p>

                  <p className="text-xs text-slate-500">
                    Results from all four compiler stages
                  </p>
                </div>
              </div>
            )}

            {stagesToDisplay.map((stage) => (
              <StageOutput
                key={stage}
                stage={stage}
                data={
                  isRunAll
                    ? normalizedResult[stage]
                    : normalizedResult
                }
              />
            ))}

            {!stagesToDisplay.length && (
              <p className="text-center text-sm text-slate-500">
                No structured results available.
              </p>
            )}
          </>
        ) : (
          <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-slate-950 p-4 font-mono text-sm leading-6 text-cyan-300">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}

      </div>
    </div>
  );
}

export default OutputPanel;