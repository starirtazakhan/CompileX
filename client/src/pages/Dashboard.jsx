import { Link, useNavigate } from "react-router-dom";

import {
  Code2,
  FileCode,
  Activity,
  Layers,
  ArrowRight,
  ScanSearch,
  GitBranch,
  Database
} from "lucide-react";

const statistics = [
  {
    title: "Compiler Stages",
    value: "04",
    description: "Available analysis engines",
    icon: Layers
  },
  {
    title: "Programs",
    value: "Ready",
    description: "Program management enabled",
    icon: FileCode
  },
  {
    title: "Compiler Engine",
    value: "Online",
    description: "Four independent stages",
    icon: Activity
  }
];

const stages = [
  {
    id: "lexical",
    title: "Lexical Analysis",
    description: "Convert source code into tokens.",
    icon: ScanSearch,
    number: "01"
  },
  {
    id: "syntax",
    title: "Syntax Analysis",
    description: "Validate grammar and generate AST.",
    icon: GitBranch,
    number: "02"
  },
  {
    id: "semantic",
    title: "Semantic Analysis",
    description: "Check types and variable declarations.",
    icon: Database,
    number: "03"
  },
  {
    id: "icg",
    title: "Intermediate Code",
    description: "Generate three-address code.",
    icon: Code2,
    number: "04"
  }
];

function Dashboard() {
  const navigate = useNavigate();

  const openStage = (stageId) => {
    navigate("/compiler", {
      state: {
        runStage: stageId
      }
    });
  };

  return (
    <div className="space-y-8">

      {/* Welcome Section */}
      <section className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-slate-900 p-8">

        <div className="max-w-2xl">

          <p className="mb-3 text-sm font-semibold text-cyan-400">
            COMPILER CONSTRUCTION PLATFORM
          </p>

          <h1 className="text-3xl font-bold text-white">
            Welcome to CompileX
          </h1>

          <p className="mt-3 leading-7 text-slate-400">
            Explore compiler construction through lexical,
            syntax, semantic analysis and intermediate code
            generation in one unified workspace.
          </p>

          <Link
            to="/compiler"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Open Compiler Workspace
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

      {/* Statistics */}
      <section>

        <h2 className="mb-4 text-lg font-semibold text-white">
          Platform Overview
        </h2>

        <div className="grid gap-5 md:grid-cols-3">

          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5"
              >

                <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-400">
                    {item.title}
                  </p>

                  <Icon className="text-cyan-400" size={22} />

                </div>

                <h3 className="mt-4 text-2xl font-bold text-white">
                  {item.value}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {item.description}
                </p>

              </div>
            );
          })}

        </div>

      </section>

      {/* Compiler Pipeline */}
      <section>

        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-lg font-semibold text-white">
            Compiler Pipeline
          </h2>

          <span className="text-xs text-slate-500">
            Four independent stages
          </span>

        </div>

        <div className="grid gap-4 md:grid-cols-2">

          {stages.map((stage) => {
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => openStage(stage.id)}
                className="group rounded-xl border border-slate-800 bg-slate-900 p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-cyan-500/60 hover:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >

                <div className="flex items-start justify-between">

                  <div className="rounded-lg bg-cyan-500/10 p-3 transition group-hover:bg-cyan-500/20">

                    <Icon
                      size={23}
                      className="text-cyan-400"
                    />

                  </div>

                  <span className="text-sm font-semibold text-slate-600">
                    {stage.number}
                  </span>

                </div>

                <h3 className="mt-4 font-semibold text-white">
                  {stage.title}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {stage.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-cyan-400 opacity-0 transition group-hover:opacity-100">

                  Open Analysis
                  <ArrowRight size={14} />

                </div>

              </button>
            );
          })}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;