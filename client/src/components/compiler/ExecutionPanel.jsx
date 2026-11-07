import {
  Terminal,
  CheckCircle2,
  XCircle,
  Variable,
} from "lucide-react";

function ExecutionPanel({ result, loading }) {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        Executing program...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <Terminal size={38} className="text-slate-600" />

        <h3 className="font-semibold text-slate-300">
          No execution results yet
        </h3>

        <p className="max-w-xs text-sm text-slate-500">
          Click Execute Program to run your CompileX-C code.
        </p>
      </div>
    );
  }

  const success = result.success;

  return (
    <div className="h-full space-y-5 overflow-y-auto p-4">

      {/* Execution Status */}
      <div
        className={`flex items-center gap-3 rounded-lg border p-4 ${
          success
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "border-red-500/30 bg-red-500/10"
        }`}
      >
        {success ? (
          <CheckCircle2 className="text-emerald-400" size={22} />
        ) : (
          <XCircle className="text-red-400" size={22} />
        )}

        <div>
          <p
            className={`font-semibold ${
              success ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {success ? "Execution Successful" : "Execution Failed"}
          </p>

          <p className="text-xs text-slate-400">
            {success
              ? "Program completed without runtime errors."
              : `Failure stage: ${result.failed_stage || "UNKNOWN"}`}
          </p>
        </div>
      </div>

      {/* Program Output */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Terminal size={17} className="text-cyan-400" />

          <h3 className="font-semibold text-white">
            Program Output
          </h3>
        </div>

        <div className="min-h-28 rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-sm">
          {success && result.output?.length > 0 ? (
            result.output.map((line, index) => (
              <p key={index} className="mb-2 text-emerald-400">
                <span className="mr-3 text-slate-600">
                  {index + 1}
                </span>
                {line}
              </p>
            ))
          ) : success ? (
            <p className="text-slate-500">
              Program completed without producing output.
            </p>
          ) : (
            <p className="text-slate-500">
              No output generated.
            </p>
          )}
        </div>
      </section>

      {/* Runtime Errors */}
      {!success && result.errors?.length > 0 && (
        <section>
          <h3 className="mb-3 font-semibold text-red-400">
            Runtime / Compilation Errors
          </h3>

          <div className="space-y-2">
            {result.errors.map((error, index) => (
              <div
                key={index}
                className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-300"
              >
                {typeof error === "string"
                  ? error
                  : error.message || JSON.stringify(error)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Variables */}
      {success && result.variables?.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Variable size={17} className="text-cyan-400" />

            <h3 className="font-semibold text-white">
              Final Variable Values
            </h3>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/70 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Variable</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Value</th>
                </tr>
              </thead>

              <tbody>
                {result.variables.map((variable) => (
                  <tr
                    key={variable.name}
                    className="border-t border-slate-800"
                  >
                    <td className="px-4 py-3 font-mono text-cyan-400">
                      {variable.name}
                    </td>

                    <td className="px-4 py-3 text-slate-400">
                      {variable.data_type}
                    </td>

                    <td className="px-4 py-3 font-mono text-emerald-400">
                      {variable.initialized
                        ? variable.value
                        : "Uninitialized"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </div>
  );
}

export default ExecutionPanel;