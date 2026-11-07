import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Code2,
  Trash2,
  Edit3,
  Clock,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";

function MyPrograms() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchPrograms = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/programs");

      const data = response.data;

      const programList =
        data.programs ||
        data.data?.programs ||
        (Array.isArray(data.data) ? data.data : []);

      setPrograms(programList);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your programs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  let ignore = false;

  const loadPrograms = async () => {
    try {
      const response = await api.get("/programs");

      const data = response.data;

      const programList =
        data.programs ||
        data.data?.programs ||
        (Array.isArray(data.data) ? data.data : []);

      if (!ignore) {
        setPrograms(programList);
      }
    } catch (err) {
      if (!ignore) {
        setError(
          err.response?.data?.message ||
            "Unable to load your programs."
        );
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  loadPrograms();

  return () => {
    ignore = true;
  };
}, []);

  const openProgram = (program) => {
    navigate("/compiler", {
      state: { program },
    });
  };

  const deleteProgram = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this program?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      await api.delete(`/programs/${id}`);

      setPrograms((previous) =>
        previous.filter((program) => program._id !== id)
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to delete this program."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            My Programs
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage and organize your saved source code.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchPrograms}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            onClick={() => navigate("/compiler")}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
          >
            <Plus size={17} />
            New Program
          </button>
        </div>
      </div>

      {/* Program Count */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">
          Total Saved Programs
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          {programs.length}
        </h2>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2
            size={30}
            className="animate-spin text-cyan-400"
          />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && programs.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 py-16 text-center">
          <Code2
            size={42}
            className="mx-auto mb-4 text-slate-500"
          />

          <h3 className="text-lg font-semibold text-white">
            No Programs Yet
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Create your first program using the compiler workspace.
          </p>

          <button
            onClick={() => navigate("/compiler")}
            className="mt-5 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500"
          >
            Create Your First Program
          </button>
        </div>
      )}

      {/* Programs Grid */}
      {!loading && !error && programs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program._id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-500/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-cyan-500/10 p-3 text-cyan-400">
                    <Code2 size={21} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {program.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {program.language || "CompileX-C"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteProgram(program._id)}
                  disabled={deletingId === program._id}
                  title="Delete program"
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                >
                  {deletingId === program._id ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Trash2 size={17} />
                  )}
                </button>
              </div>

              {/* Code Preview */}
              <div className="mt-5 rounded-lg bg-slate-950 p-3">
                <pre className="max-h-28 overflow-hidden whitespace-pre-wrap break-words font-mono text-xs leading-5 text-slate-400">
                  {program.sourceCode || "// Empty program"}
                </pre>
              </div>

              {/* Date */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Clock size={14} />

                Last updated:{" "}
                {program.updatedAt
                  ? new Date(program.updatedAt).toLocaleDateString()
                  : "Unknown"}
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => openProgram(program)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500"
                >
                  <Edit3 size={16} />
                  Open & Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPrograms;