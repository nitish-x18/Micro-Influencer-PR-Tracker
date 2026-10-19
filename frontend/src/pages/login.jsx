import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/influenceflow-logo.png";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    // Email validation
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    let savedUser = null;

    try {
      savedUser = JSON.parse(localStorage.getItem("influenceflow_user"));
    } catch {
      localStorage.removeItem("influenceflow_user");
    }

    if (!savedUser) {
      setError("No account found. Please create an account first.");
      return;
    }

    // Credential check
    if (savedUser.email !== email || savedUser.password !== password) {
      setError("Incorrect email or password.");
      return;
    }

    setIsSubmitting(true);

    const session = {
      fullName: savedUser.fullName,
      email: savedUser.email,
    };

    const sessionData = JSON.stringify(session);

    /*
      Temporary frontend authentication.

      If "Keep me signed in" is checked, keep the session
      in localStorage.

      Otherwise use sessionStorage for the current browser tab.
    */
    if (form.remember) {
      localStorage.setItem("influenceflow_session", sessionData);

      sessionStorage.removeItem("influenceflow_session");
    } else {
      sessionStorage.setItem("influenceflow_session", sessionData);

      localStorage.removeItem("influenceflow_session");
    }

    setSuccess("Login successful. Redirecting...");

    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  };

  const handleForgotPassword = () => {
    setError("");
    setSuccess(
      "Password reset will be available after the backend email service is connected.",
    );
  };

  const handleGoogleLogin = () => {
    setError("");
    setSuccess(
      "Google sign-in will be available after authentication is connected.",
    );
  };

  return (
    <div className="min-h-screen bg-[#eef8ff]">
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between px-6 lg:px-10">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="InfluenceFlow"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <Link
              to="/register"
              className="text-sm font-semibold text-[#17345f] hover:text-cyan-600"
            >
              Create account
            </Link>
          </div>
        </header>

        {/* Login */}
        <main className="flex flex-1 items-center justify-center px-5 py-12">
          <div className="w-full max-w-[430px] rounded-2xl bg-white p-8 shadow-xl shadow-slate-300/40 sm:p-10">
            {/* Heading */}
            <div className="text-center">
              <div className="text-[24px] font-extrabold tracking-tight text-[#12336d]">
                influence
                <span className="text-cyan-500">flow</span>
              </div>

              <div className="mt-1 text-[7px] font-bold tracking-[3px] text-[#12336d]">
                PR TRACKER
              </div>

              <h1 className="mt-7 text-2xl font-extrabold text-slate-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to see your PR dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                  {success}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Email
                </label>

                <div className="flex h-12 items-center rounded-lg border border-slate-300 bg-white px-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                  <Mail size={17} className="text-slate-400" />

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="creator@example.com"
                    autoComplete="email"
                    className="ml-2 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Password
                </label>

                <div className="flex h-12 items-center rounded-lg border border-slate-300 bg-white px-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                  <LockKeyhole size={17} className="text-slate-400" />

                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••••"
                    autoComplete="current-password"
                    className="ml-2 w-full bg-transparent text-sm text-slate-800 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="text-slate-400 hover:text-slate-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-slate-500">
                  <input
                    name="remember"
                    type="checkbox"
                    checked={form.remember}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Keep me signed in
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign in */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold text-white transition ${
                  isSubmitting
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-[#e56b3e] hover:bg-[#d85d31]"
                }`}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}

                {!isSubmitting && <ArrowRight size={17} />}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs text-slate-400">or</span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <span className="text-base font-bold text-[#4285F4]">G</span>
                Sign in with Google
              </button>

              {/* Register */}
              <p className="pt-1 text-center text-sm text-slate-500">
                New here?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-[1400px] px-6 py-4 text-xs text-slate-500 lg:px-10">
            InfluenceFlow · PR Tracker
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Login;
