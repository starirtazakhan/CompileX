import { useEffect, useState } from "react";
import {
  ShieldCheck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Activity,
  Clock,
  Filter,
} from "lucide-react";

import api from "../services/api";

const actions = [
  "PROGRAM_CREATED",
  "PROGRAM_UPDATED",
  "PROGRAM_DELETED",
  "LEXICAL_ANALYSIS",
  "SYNTAX_ANALYSIS",
  "SEMANTIC_ANALYSIS",
  "ICG_GENERATED",
  "RUN_ALL",
];

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedAction, setSelectedAction] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");

  const limit = 10;

  useEffect(() => {
    let ignore = false;

    const loadLogs = async () => {
      try {
        const params = {
          page: currentPage,
          limit,
        };

        if (selectedAction) {
          params.action = selectedAction;
        }

        const response = await api.get("/audit-logs", { params });

        if (ignore) return;

        const data = response.data;

        setLogs(data.logs || []);
        setTotalLogs(data.totalLogs || 0);
        setCurrentPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 0);
        setError("");
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
              "Unable to load audit logs."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadLogs();

    return () => {
      ignore = true;
    };
  }, [currentPage, selectedAction, refreshKey]);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;

    setLoading(true);
    setCurrentPage(page);
  };

  const changeAction = (event) => {
    setLoading(true);
    setSelectedAction(event.target.value);
    setCurrentPage(1);
  };

  const refreshLogs = () => {
    setLoading(true);
    setRefreshKey((previous) => previous + 1);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString();
  };

  const formatAction = (action) => {
    return action
      ?.replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-cyan-400" size={28} />

            <h1 className="text-2xl font-bold text-white">
              Audit Logs
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Monitor user activities and compiler operations.
          </p>
        </div>

        <button
          onClick={refreshLogs}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <Activity className="text-cyan-400" size={22} />
            <span className="text-sm text-slate-400">
              Total Activities
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {totalLogs}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <Clock className="text-purple-400" size={22} />
            <span className="text-sm text-slate-400">
              Current Page
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {currentPage} / {totalPages || 1}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter size={18} />
          <span className="text-sm">Filter by action</span>
        </div>

        <select
          value={selectedAction}
          onChange={changeAction}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
        >
          <option value="">All Activities</option>

          {actions.map((action) => (
            <option key={action} value={action}>
              {formatAction(action)}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <h2 className="font-semibold text-white">
            Activity History
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Showing {logs.length} of {totalLogs} activities
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-cyan-400">
            <Loader2 className="animate-spin" size={22} />
            <span className="text-sm">Loading audit logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck
              size={38}
              className="mx-auto mb-3 text-slate-600"
            />

            <p className="font-medium text-white">
              No audit logs found
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Activities will appear here when users perform
              compiler operations or manage programs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Action</th>
                  <th className="px-5 py-4">Resource</th>
                  <th className="px-5 py-4">Details</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {logs.map((log) => (
                  <tr key={log._id} className="text-slate-300">
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">
                        {log.user?.name || "Unknown User"}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {log.user?.email || "N/A"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-block rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400">
                        {formatAction(log.action)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {log.resourceType || "N/A"}
                    </td>

                    <td className="max-w-xs px-5 py-4 text-slate-400">
                      {log.details || "No details"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-400">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 0 && (
          <div className="flex items-center justify-between border-t border-slate-800 p-4">
            <p className="text-xs text-slate-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogs;