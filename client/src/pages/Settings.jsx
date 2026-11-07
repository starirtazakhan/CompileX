import { useState } from "react";

import {
  Settings as SettingsIcon,
  User,
  Code2,
  Save,
  RotateCcw,
  CheckCircle,
  Sun,
  Moon,
  Palette
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

const defaultSettings = {
  fontSize: 14,
  tabSize: 4,
  wordWrap: "on",
  minimap: false
};

const getSavedSettings = () => {
  try {
    const saved = localStorage.getItem(
      "compilex_editor_settings"
    );

    return saved
      ? { ...defaultSettings, ...JSON.parse(saved) }
      : defaultSettings;

  } catch {
    return defaultSettings;
  }
};

function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [preferences, setPreferences] = useState(
    getSavedSettings
  );

  const [message, setMessage] = useState("");

  const handleChange = (field, value) => {
    setPreferences((previous) => ({
      ...previous,
      [field]: value
    }));

    setMessage("");
  };

  const savePreferences = () => {
    localStorage.setItem(
      "compilex_editor_settings",
      JSON.stringify(preferences)
    );

    setMessage("Preferences saved successfully.");
  };

  const resetPreferences = () => {
    setPreferences(defaultSettings);

    localStorage.setItem(
      "compilex_editor_settings",
      JSON.stringify(defaultSettings)
    );

    setMessage("Preferences restored to default.");
  };

  const cardClass =
    "rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6";

  const inputClass =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-cyan-500";

  return (
    <div className="mx-auto max-w-4xl space-y-7">

      {/* Heading */}
      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-cyan-500/10 p-3">
          <SettingsIcon
            size={25}
            className="text-cyan-500"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Settings
          </h1>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Manage your account and workspace preferences.
          </p>
        </div>

      </div>

      {/* Account Information */}
      <section className={cardClass}>

        <div className="mb-6 flex items-center gap-3">

          <User size={21} className="text-cyan-500" />

          <h2 className="font-semibold text-[var(--text-primary)]">
            Account Information
          </h2>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {[
            ["Full Name", user?.name],
            ["Email Address", user?.email],
            ["Account Role", user?.role]
          ].map(([label, value]) => (
            <div key={label}>

              <p className="mb-2 text-xs text-[var(--text-muted)]">
                {label}
              </p>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3 text-sm text-[var(--text-primary)]">
                {value || "Not available"}
              </div>

            </div>
          ))}

        </div>

        <p className="mt-4 text-xs text-[var(--text-muted)]">
          Account information is currently read-only.
        </p>

      </section>

      {/* Appearance */}
      <section className={cardClass}>

        <div className="mb-6 flex items-center gap-3">

          <Palette size={21} className="text-cyan-500" />

          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">
              Appearance
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Choose your preferred application theme.
            </p>
          </div>

        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex items-center gap-4 rounded-xl border p-5 transition ${
              theme === "light"
                ? "border-cyan-500 bg-cyan-500/10"
                : "border-[var(--border)] bg-[var(--surface-secondary)]"
            }`}
          >

            <Sun
              size={26}
              className="text-amber-500"
            />

            <div className="text-left">
              <p className="font-semibold text-[var(--text-primary)]">
                Light Theme
              </p>

              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Bright and clean appearance.
              </p>
            </div>

          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-4 rounded-xl border p-5 transition ${
              theme === "dark"
                ? "border-cyan-500 bg-cyan-500/10"
                : "border-[var(--border)] bg-[var(--surface-secondary)]"
            }`}
          >

            <Moon
              size={26}
              className="text-cyan-500"
            />

            <div className="text-left">
              <p className="font-semibold text-[var(--text-primary)]">
                Dark Theme
              </p>

              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Comfortable low-light appearance.
              </p>
            </div>

          </button>

        </div>

        <p className="mt-4 text-xs text-[var(--text-muted)]">
          Your selected theme is saved automatically.
        </p>

      </section>

      {/* Editor Preferences */}
      <section className={cardClass}>

        <div className="mb-6 flex items-center gap-3">

          <Code2 size={21} className="text-cyan-500" />

          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">
              Editor Preferences
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Customize your Monaco code editor.
            </p>
          </div>

        </div>

        <div className="space-y-6">

          {/* Font Size */}
          <div>

            <label className="mb-3 block text-sm text-[var(--text-secondary)]">
              Font Size
            </label>

            <div className="flex items-center gap-4">

              <input
                type="range"
                min="12"
                max="24"
                value={preferences.fontSize}
                onChange={(e) =>
                  handleChange(
                    "fontSize",
                    Number(e.target.value)
                  )
                }
                className="w-full accent-cyan-500"
              />

              <span className="w-12 text-sm text-cyan-500">
                {preferences.fontSize}px
              </span>

            </div>

          </div>

          {/* Tab Size */}
          <div>

            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
              Tab Size
            </label>

            <select
              value={preferences.tabSize}
              onChange={(e) =>
                handleChange(
                  "tabSize",
                  Number(e.target.value)
                )
              }
              className={inputClass}
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value={8}>8 Spaces</option>
            </select>

          </div>

          {/* Word Wrap */}
          <div>

            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
              Word Wrapping
            </label>

            <select
              value={preferences.wordWrap}
              onChange={(e) =>
                handleChange("wordWrap", e.target.value)
              }
              className={inputClass}
            >
              <option value="on">Enabled</option>
              <option value="off">Disabled</option>
            </select>

          </div>

          {/* Minimap */}
          <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] p-4">

            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Editor Minimap
              </p>

              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Show a miniature overview of your source code.
              </p>
            </div>

            <input
              type="checkbox"
              checked={preferences.minimap}
              onChange={(e) =>
                handleChange("minimap", e.target.checked)
              }
              className="h-4 w-4 accent-cyan-500"
            />

          </div>

        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">

          <button
            onClick={savePreferences}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            <Save size={17} />
            Save Preferences
          </button>

          <button
            onClick={resetPreferences}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-3 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--hover)]"
          >
            <RotateCcw size={17} />
            Reset Defaults
          </button>

        </div>

        {message && (
          <p className="mt-4 flex items-center gap-2 text-sm text-emerald-500">
            <CheckCircle size={16} />
            {message}
          </p>
        )}

      </section>

    </div>
  );
}

export default Settings;