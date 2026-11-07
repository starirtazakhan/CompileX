import { NavLink } from "react-router-dom";

import {
  ShieldCheck,
  LayoutDashboard,
  Code2,
  FolderCode,
  ScrollText,
  Settings
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

function Sidebar() {
  const { user } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    },
    {
      name: "Compiler Workspace",
      path: "/compiler",
      icon: Code2
    },
    {
      name: "My Programs",
      path: "/programs",
      icon: FolderCode
    }
  ];

  if (user?.role === "ADMIN") {
    navigation.push({
      name: "Audit Logs",
      path: "/audit-logs",
      icon: ScrollText
    });
  }

  navigation.push({
    name: "Settings",
    path: "/settings",
    icon: Settings
  });

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-300">

      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">

        <div className="rounded-xl bg-cyan-500/10 p-2">
          <ShieldCheck
            size={27}
            className="text-cyan-400"
          />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-wide text-white">
            CompileX
          </h1>

          <p className="text-xs text-slate-500">
            Compiler Analysis Platform
          </p>
        </div>

      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-7">

        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Workspace
        </p>

        <nav className="space-y-2">

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                    isActive
                      ? "bg-cyan-500/10 font-semibold text-cyan-400"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>

      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-4">

        <p className="px-3 text-xs text-slate-600">
          CompileX v1.0.0
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;