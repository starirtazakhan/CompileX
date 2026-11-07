import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ShieldCheck, User, Mail, Lock } from "lucide-react";

import { useAuth } from "../hooks/useAuth";

function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password
      );

      navigate("/", { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

        <div className="mb-7 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">
            <ShieldCheck
              size={32}
              className="text-cyan-400"
            />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Join the CompileX platform
          </p>

        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Full Name
            </label>

            <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3">
              <User size={18} className="text-slate-500" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                minLength={2}
                maxLength={50}
                required
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email Address
            </label>

            <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3">
              <Mail size={18} className="text-slate-500" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>

            <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3">
              <Lock size={18} className="text-slate-500" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Confirm Password
            </label>

            <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3">
              <Lock size={18} className="text-slate-500" />

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-cyan-500 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Sign In
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;