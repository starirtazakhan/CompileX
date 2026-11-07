// import { useState } from "react";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import { ShieldCheck, Lock, Mail } from "lucide-react";

// import { useAuth } from "../hooks/useAuth";

// function Login() {
//   const { login, user } = useAuth();
//   console.log("Login component rendered", { user });
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });

//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   if (user) {
//     return <Navigate to="/" replace />;
//   }

//   const handleChange = (event) => {
//     setFormData({
//       ...formData,
//       [event.target.name]: event.target.value
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setError("");
//     setSubmitting(true);

//     try {
//       await login(
//         formData.email,
//         formData.password
//       );

//       navigate("/", { replace: true });
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//         error.message ||
//         "Login failed. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">

//       <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

//         <div className="mb-8 text-center">

//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">
//             <ShieldCheck
//               size={32}
//               className="text-cyan-400"
//             />
//           </div>

//           <h1 className="text-2xl font-bold text-white">
//             Welcome Back
//           </h1>

//           <p className="mt-2 text-sm text-slate-400">
//             Sign in to your CompileX account
//           </p>

//         </div>

//         {error && (
//           <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">

//           <div>
//             <label className="mb-2 block text-sm text-slate-300">
//               Email Address
//             </label>

//             <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3">
//               <Mail size={18} className="text-slate-500" />

//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="you@example.com"
//                 required
//                 className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="mb-2 block text-sm text-slate-300">
//               Password
//             </label>

//             <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3">
//               <Lock size={18} className="text-slate-500" />

//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 required
//                 className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={submitting}
//             className="w-full rounded-lg bg-cyan-500 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {submitting ? "Signing in..." : "Sign In"}
//           </button>

//         </form>

//         <p className="mt-7 text-center text-sm text-slate-400">
//           Don't have an account?{" "}
//           <Link
//             to="/register"
//             className="font-semibold text-cyan-400 hover:text-cyan-300"
//           >
//             Create Account
//           </Link>
//         </p>

//       </div>

//     </div>
//   );
// }

// export default Login;

// // function Login() {
// //   return (
// //     <div style={{ color: "red", padding: "30px" }}>
// //       <h1>CompileX Login Component is Working!</h1>
// //     </div>
// //   );
// // }

// // export default Login;

import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Code2
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
          <p className="mt-4 text-sm text-slate-400">
            Restoring your session...
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login(
        formData.email.trim(),
        formData.password
      );

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">

      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
            <ShieldCheck
              size={36}
              className="text-cyan-400"
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            <Code2 size={20} className="text-cyan-400" />

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Compile<span className="text-cyan-400">X</span>
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Compiler Construction & Analysis Platform
          </p>

        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-white">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Sign in to continue to your workspace.
            </p>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3 transition focus-within:border-cyan-500">

                <Mail
                  size={18}
                  className="shrink-0 text-slate-500"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3 transition focus-within:border-cyan-500">

                <Lock
                  size={18}
                  className="shrink-0 text-slate-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="text-slate-500 transition hover:text-cyan-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {submitting ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <ArrowRight size={17} />
                </>
              )}

            </button>

          </form>

          {/* Register Link */}
          <p className="mt-7 text-center text-sm text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Create Account
            </Link>

          </p>

        </div>

        {/* Footer */}
        <p className="mt-7 text-center text-xs text-slate-600">
          CompileX Compiler Analysis Platform
        </p>

      </div>

    </div>
  );
}

export default Login;