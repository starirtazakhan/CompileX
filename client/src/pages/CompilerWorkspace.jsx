import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Editor from "@monaco-editor/react";
import { defineEmeraldTheme } from "../utils/MonacoTheme";

import {
  Play,
  Code2,
  Braces,
  ShieldCheck,
  Binary,
  RotateCcw,
  Loader2,
  Terminal,
  Save,
  Cpu,
} from "lucide-react";

import api from "../services/api";
import OutputPanel from "../components/compiler/OutputPanel";
import ExecutionPanel from "../components/compiler/ExecutionPanel";
import { addNotification } from "../services/notificationService";
import { useTheme } from "../hooks/useTheme";

const initialCode = `int a = 10;
int b = 20;
int sum;

sum = a + b;

print(sum);`;

const stages = [
  {
    id: "lexical",
    label: "Lexical Analysis",
    endpoint: "/compiler/lexical",
    icon: Code2,
  },
  {
    id: "syntax",
    label: "Syntax Analysis",
    endpoint: "/compiler/syntax",
    icon: Braces,
  },
  {
    id: "semantic",
    label: "Semantic Analysis",
    endpoint: "/compiler/semantic",
    icon: ShieldCheck,
  },
  {
    id: "icg",
    label: "Intermediate Code",
    endpoint: "/compiler/icg",
    icon: Binary,
  },
];

// Editor settings
const getEditorSettings = () => {
  const defaults = {
    fontSize: 14,
    tabSize: 4,
    wordWrap: "on",
    minimap: false,
  };

  try {
    const saved = localStorage.getItem(
      "compilex_editor_settings"
    );

    return saved
      ? { ...defaults, ...JSON.parse(saved) }
      : defaults;
  } catch {
    return defaults;
  }
};

function CompilerWorkspace() {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme } = useTheme();

  const [editorSettings] = useState(getEditorSettings);

  const [code, setCode] = useState(
    () => location.state?.program?.sourceCode || initialCode
  );

  const [title, setTitle] = useState(
    () => location.state?.program?.title || "Untitled Program"
  );

  const [programId, setProgramId] = useState(
    () => location.state?.program?._id || null
  );

  // Compiler results
  const [results, setResults] = useState({});

  // Execution result
  const [executionResult, setExecutionResult] = useState(null);

  // Currently selected stage
  const [activeStage, setActiveStage] = useState("lexical");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  // Normalize API responses
  const getResponseResult = (response) => {
    return (
      response.data?.result ??
      response.data?.data?.result ??
      response.data
    );
  };

  // Save or update program
  const saveProgram = async () => {
    if (!title.trim()) {
      setError("Please enter a program title.");
      return;
    }

    setSaving(true);
    setError("");
    setSaveMessage("");

    try {
      const programData = {
        title: title.trim(),
        sourceCode: code,
        language: "CompileX-C",
      };

      let response;

      if (programId) {
        response = await api.patch(
          `/programs/${programId}`,
          programData
        );
      } else {
        response = await api.post(
          "/programs",
          programData
        );
      }

      const savedProgram =
        response.data.program ||
        response.data.data?.program;

      if (!programId && savedProgram?._id) {
        setProgramId(savedProgram._id);
      }

      addNotification({
        title: programId
          ? "Program Updated"
          : "Program Saved",
        message: `"${title.trim()}" was saved successfully.`,
        type: "success",
      });

      setSaveMessage(
        programId
          ? "Program updated successfully."
          : "Program saved successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save the program."
      );
    } finally {
      setSaving(false);
    }
  };

  // Run an individual compiler stage
  const runStage = useCallback(
    async (stage) => {
      setActiveStage(stage.id);
      setLoading(true);
      setError("");
      setSaveMessage("");

      try {
        const response = await api.post(stage.endpoint, {
          sourceCode: code,
        });

        const stageResult = getResponseResult(response);

        console.log(
          `${stage.label} API Response:`,
          stageResult
        );

        setResults((previous) => ({
          ...previous,
          [stage.id]: stageResult,
        }));

        addNotification({
          title: `${stage.label} Completed`,
          message: `${stage.label} finished successfully.`,
          type: "success",
        });
      } catch (err) {
        console.error(
          `${stage.label} Error:`,
          err.response?.data || err
        );

        setError(
          err.response?.data?.message ||
            err.response?.data?.detail ||
            err.message ||
            "Something went wrong."
        );

        setResults((previous) => ({
          ...previous,
          [stage.id]: null,
        }));

        addNotification({
          title: `${stage.label} Failed`,
          message:
            err.response?.data?.message ||
            "Compiler stage could not be completed.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [code]
  );

  // Automatically run a stage opened from Dashboard
  const autoRunRef = useRef("");

  useEffect(() => {
    const requestedStage = location.state?.runStage;

    if (!requestedStage) {
      return;
    }

    const stage = stages.find(
      (item) => item.id === requestedStage
    );

    if (!stage) {
      return;
    }

    const requestKey = `${location.key}-${requestedStage}`;

    if (autoRunRef.current === requestKey) {
      return;
    }

    autoRunRef.current = requestKey;

    runStage(stage);
  }, [location.key, location.state, runStage]);

  // Run all compiler stages
  const runAll = async () => {
    setActiveStage("all");
    setLoading(true);
    setError("");
    setSaveMessage("");

    try {
      const response = await api.post(
        "/compiler/run-all",
        {
          sourceCode: code,
        }
      );

      const allResults = getResponseResult(response);

      console.log("Run All API Response:", allResults);

      setResults(allResults);

      addNotification({
        title: "Compilation Completed",
        message: "All compiler stages have been executed.",
        type: "success",
      });
    } catch (err) {
      console.error(
        "Run All Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Something went wrong."
      );

      addNotification({
        title: "Compilation Failed",
        message:
          err.response?.data?.message ||
          "Unable to complete compilation.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Execute program
  const executeProgram = async () => {
    setActiveStage("execution");
    setLoading(true);
    setError("");
    setSaveMessage("");

    try {
      const response = await api.post(
        "/compiler/execute",
        {
          sourceCode: code,
        }
      );

      const execution = getResponseResult(response);

      console.log("Execution API Response:", execution);

      setExecutionResult(execution);

      addNotification({
        title: execution.success
          ? "Program Executed Successfully"
          : "Program Execution Failed",

        message: execution.success
          ? `Program output: ${
              execution.output?.join(", ") || "No output"
            }`
          : execution.errors?.join(", ") ||
            "Execution failed.",

        type: execution.success ? "success" : "error",
      });
    } catch (err) {
      console.error(
        "Execution Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Unable to execute program."
      );

      addNotification({
        title: "Execution Failed",
        message:
          err.response?.data?.message ||
          "Unable to execute program.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset workspace
  const resetWorkspace = () => {
    setCode(initialCode);
    setTitle("Untitled Program");
    setProgramId(null);

    setResults({});
    setExecutionResult(null);

    setError("");
    setSaveMessage("");

    setActiveStage("lexical");

    navigate("/compiler", {
      replace: true,
      state: null,
    });
  };

  // Currently selected result
  const activeResult =
    activeStage === "all"
      ? results
      : results[activeStage];

  // Current stage label
  const activeStageLabel =
    activeStage === "all"
      ? "All Stages"
      : activeStage === "execution"
      ? "Program Execution"
      : stages.find(
          (stage) => stage.id === activeStage
        )?.label;

  return (
    <div className="space-y-6">

      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Compiler Workspace
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Write, analyze, execute, and generate intermediate code.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          <button
            onClick={resetWorkspace}
            disabled={loading || saving}
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-50"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            onClick={saveProgram}
            disabled={saving || loading}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {saving ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Save size={16} />
            )}

            {programId
              ? "Update Program"
              : "Save Program"}
          </button>

        </div>
      </div>

      {/* Program Title */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

        <label className="mb-2 block text-sm font-medium text-slate-300">
          Program Name
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setSaveMessage("");
          }}
          placeholder="Enter program title"
          maxLength={100}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
        />

        {programId && (
          <p className="mt-2 text-xs text-cyan-400">
            Editing an existing saved program.
          </p>
        )}

        {saveMessage && (
          <p className="mt-2 text-sm text-emerald-400">
            {saveMessage}
          </p>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}

      </div>

      {/* Compiler Buttons */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">

        {stages.map((stage) => {
          const Icon = stage.icon;

          return (
            <button
              key={stage.id}
              onClick={() => runStage(stage)}
              disabled={loading || saving}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm transition ${
                activeStage === stage.id
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                  : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Icon size={17} />
              <span>{stage.label}</span>
            </button>
          );
        })}

        {/* Run All */}
        <button
          onClick={runAll}
          disabled={loading || saving}
          className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
            activeStage === "all"
              ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
              : "border-slate-800 bg-slate-900 text-white hover:border-cyan-500"
          } disabled:opacity-50`}
        >
          {loading && activeStage === "all" ? (
            <Loader2
              size={17}
              className="animate-spin"
            />
          ) : (
            <Play size={17} />
          )}

          Run All
        </button>

        {/* Execute */}
        <button
          onClick={executeProgram}
          disabled={loading || saving}
          className={`col-span-2 flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-bold transition xl:col-span-6 ${
            activeStage === "execution"
              ? "bg-emerald-500 text-white"
              : "bg-emerald-600 text-white hover:bg-emerald-500"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {loading && activeStage === "execution" ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Cpu size={18} />
          )}

          Execute Program
        </button>

      </div>

      {/* Editor and Output */}
      <div className="grid min-h-[650px] grid-cols-1 gap-5 xl:grid-cols-2">

        {/* Code Editor */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">

            <div className="flex items-center gap-2">
              <Code2
                size={17}
                className="text-cyan-400"
              />

              <span className="text-sm font-semibold text-white">
                Source Code
              </span>
            </div>

            <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
              CompileX-C
            </span>

          </div>

          <Editor
            height="590px"
            language="cpp"
            beforeMount={defineEmeraldTheme}
            theme={
              theme === "dark"
                ? "emerald-terminal"
                : "light"
            }
            value={code}
            onChange={(value) => {
              setCode(value || "");
              setSaveMessage("");
            }}
            options={{
              fontSize: editorSettings.fontSize,
              minimap: {
                enabled: editorSettings.minimap,
              },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16 },
              tabSize: editorSettings.tabSize,
              wordWrap: editorSettings.wordWrap,
              lineNumbers: "on",
              cursorBlinking: "smooth",
              smoothScrolling: true,
            }}
          />

        </div>

        {/* Output */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 px-4 py-3">

            {activeStage === "execution" ? (
              <Cpu
                size={17}
                className="text-emerald-400"
              />
            ) : (
              <Terminal
                size={17}
                className="text-cyan-400"
              />
            )}

            <span className="text-sm font-semibold text-white">
              {activeStage === "execution"
                ? "Execution Output"
                : "Compiler Output"}
            </span>

            <span className="ml-auto text-xs text-slate-500">
              {activeStageLabel}
            </span>

          </div>

          <div className="h-[590px]">

            {activeStage === "execution" ? (
              <ExecutionPanel
                result={executionResult}
                loading={loading}
              />
            ) : (
              <OutputPanel
                result={activeResult}
                loading={loading}
                error={error}
                activeStage={activeStage}
                stageLabel={activeStageLabel}
              />
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default CompilerWorkspace;