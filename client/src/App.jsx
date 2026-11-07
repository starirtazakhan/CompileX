// import { Routes, Route, useLocation } from "react-router-dom";

// import ProtectedRoute from "./components/ProtectedRoute";
// import Sidebar from "./components/layout/Sidebar";
// import Header from "./components/layout/Header";

// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import CompilerWorkspace from "./pages/CompilerWorkspace";
// import MyPrograms from "./pages/MyPrograms";
// import AuditLogs from "./pages/AuditLogs";
// import Settings from "./pages/Settings";
// //import ThemeProvider from "./context/ThemeProvider";

// function AppLayout() {
//   const location = useLocation();

//   return (
//     <div className="min-h-screen bg-slate-950">
//       <Sidebar />

//       <div className="ml-64 flex min-h-screen min-w-0 flex-col">
//         <Header />

//         <main className="min-w-0 w-full flex-1 p-5 md:p-8">
//           <Routes>
//   <Route path="/" element={<Dashboard />} />

//   <Route
//     path="/compiler"
//     element={<CompilerWorkspace key={location.key} />}
//   />

//   <Route path="/programs" element={<MyPrograms />} />

//   <Route
//     path="/audit-logs"
//     element={
//       <ProtectedRoute allowedRoles={["ADMIN"]}>
//         <AuditLogs />
//       </ProtectedRoute>
//     }
//   />

//   <Route path="/settings" element={<Settings />} />

//   <Route
//     path="*"
//     element={<ComingSoon title="Page Not Found" />}
//   />
// </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }

// function ComingSoon({ title }) {
//   return (
//     <div className="rounded-xl border border-slate-800 bg-slate-900 p-8">
//       <h1 className="text-2xl font-bold text-white">{title}</h1>
//       <p className="mt-2 text-slate-400">
//         This module is coming soon.
//       </p>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       <Route element={<ProtectedRoute />}>
//         <Route path="/*" element={<AppLayout />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;

// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";

// function App() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route
//         path="*"
//         element={<h1 style={{ color: "red" }}>Route Working</h1>}
//       />
//     </Routes>
//   );
// }

// export default App;

// import { Routes, Route, useLocation } from "react-router-dom";

// import ProtectedRoute from "./components/ProtectedRoute";
// import Sidebar from "./components/layout/Sidebar";
// import Header from "./components/layout/Header";

// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import CompilerWorkspace from "./pages/CompilerWorkspace";
// import MyPrograms from "./pages/MyPrograms";
// import AuditLogs from "./pages/AuditLogs";
// import Settings from "./pages/Settings";

// import ThemeProvider from "./context/ThemeProvider";

// function AppLayout() {
//   const location = useLocation();

//   return (
//     <div className="min-h-screen bg-slate-950">
//       <Sidebar />

//       <div className="ml-64 flex min-h-screen min-w-0 flex-col">
//         <Header />

//         <main className="min-w-0 w-full flex-1 p-5 md:p-8">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />

//             <Route
//               path="/compiler"
//               element={<CompilerWorkspace key={location.key} />}
//             />

//             <Route path="/programs" element={<MyPrograms />} />

//             <Route
//               path="/audit-logs"
//               element={
//                 <ProtectedRoute allowedRoles={["ADMIN"]}>
//                   <AuditLogs />
//                 </ProtectedRoute>
//               }
//             />

//             <Route path="/settings" element={<Settings />} />

//             <Route
//               path="*"
//               element={<ComingSoon title="Page Not Found" />}
//             />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }

// function ComingSoon({ title }) {
//   return (
//     <div className="rounded-xl border border-slate-800 bg-slate-900 p-8">
//       <h1 className="text-2xl font-bold text-white">{title}</h1>
//       <p className="mt-2 text-slate-400">
//         This module is coming soon.
//       </p>
//     </div>
//   );
// }

// function App() {
//   return (
//     <ThemeProvider>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         <Route element={<ProtectedRoute />}>
//           <Route path="/*" element={<AppLayout />} />
//         </Route>
//       </Routes>
//     </ThemeProvider>
//   );
// }

// export default App;

import { Routes, Route, Outlet, useLocation } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompilerWorkspace from "./pages/CompilerWorkspace";
import MyPrograms from "./pages/MyPrograms";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";

function ComingSoon({ title }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <h1 className="text-2xl font-semibold text-slate-300">{title}</h1>
    </div>
  );
}

// Remounts the workspace on every navigation (same behaviour as before)
function CompilerRoute() {
  const location = useLocation();

  return <CompilerWorkspace key={location.key} />;
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />

      <div className="ml-64 flex min-h-screen min-w-0 flex-col">
        <Header />

        <main className="min-w-0 w-full flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Everything below requires a logged-in user */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/compiler" element={<CompilerRoute />} />
        <Route path="/programs" element={<MyPrograms />} />

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<ComingSoon title="Page Not Found" />} />
      </Route>
    </Routes>
  );
}

export default App;
