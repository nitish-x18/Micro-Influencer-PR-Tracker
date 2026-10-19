import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/influenceflow-logo.png";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    // Full name
    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    if (fullName.length < 2) {
      setError("Please enter a valid full name.");
      return;
    }

    // Email
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setError("Password must contain at least one symbol.");
      return;
    }

    // Confirm password
    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Terms
    if (!form.terms) {
      setError("Please agree to the Terms and Privacy Policy.");
      return;
    }

    // Existing account
    let existingUser = null;

    try {
      existingUser = JSON.parse(localStorage.getItem("influenceflow_user"));
    } catch {
      localStorage.removeItem("influenceflow_user");
    }

    if (existingUser?.email === email) {
      setError("An account with this email already exists.");
      return;
    }

    // Prevent multiple submissions
    setIsSubmitting(true);

    const user = {
      fullName,
      email,
      password,
    };

    // Temporary frontend-only account storage.
    // This will be replaced by the backend API later.
    localStorage.setItem("influenceflow_user", JSON.stringify(user));

    setSuccess("Account created successfully. Redirecting to login...");

    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  const handleGoogleSignup = () => {
    setError("");
    setSuccess(
      "Google sign-up will be available after authentication is connected.",
    );
  };

  return (
    <div className="min-h-screen bg-[#eef8ff]">
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="InfluenceFlow"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <Link
              to="/login"
              className="text-sm font-semibold text-[#17345f] hover:text-cyan-600"
            >
              Sign in
            </Link>
          </div>
        </header>

        {/* Register */}
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-5 sm:py-10">
          <div className="w-full max-w-[460px] rounded-2xl bg-white p-6 shadow-xl shadow-slate-300/40 sm:p-10">
            {/* Heading */}
            <div className="text-center">
              <div className="text-[24px] font-extrabold tracking-tight text-[#12336d]">
                influence<span className="text-cyan-500">flow</span>
              </div>

              <div className="mt-1 text-[7px] font-bold tracking-[3px] text-[#12336d]">
                PR TRACKER
              </div>

              <h1 className="mt-7 text-2xl font-extrabold text-slate-900">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Start organizing your creator PR workflow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
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

              {/* Full name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Full name
                </label>

                <div className="flex h-12 items-center rounded-lg border border-slate-300 px-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                  <User size={17} className="text-slate-400" />

                  <input
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Email
                </label>

                <div className="flex h-12 items-center rounded-lg border border-slate-300 px-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                  <Mail size={17} className="text-slate-400" />

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="creator@example.com"
                    autoComplete="email"
                    className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Password
                </label>

                <div className="flex h-12 items-center rounded-lg border border-slate-300 px-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                  <LockKeyhole size={17} className="text-slate-400" />

                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
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

                <p className="mt-1.5 text-[11px] text-slate-400">
                  Use at least 8 characters with a number and a symbol.
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Confirm password
                </label>

                <div className="flex h-12 items-center rounded-lg border border-slate-300 px-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                  <LockKeyhole size={17} className="text-slate-400" />

                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="text-slate-400 hover:text-slate-600"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-2 pt-1 text-xs leading-5 text-slate-500">
                <input
                  name="terms"
                  type="checkbox"
                  checked={form.terms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />

                <span>
                  I agree to the{" "}
                  <span className="font-semibold text-blue-600">Terms</span> and{" "}
                  <span className="font-semibold text-blue-600">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>

              {/* Create account */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold text-white transition ${
                  isSubmitting
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-[#e56b3e] hover:bg-[#d85d31]"
                }`}
              >
                {isSubmitting ? "Creating account..." : "Create account"}

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
                onClick={handleGoogleSignup}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <span className="text-base font-bold text-[#4285F4]">G</span>
                Sign up with Google
              </button>

              {/* Login */}
              <p className="pt-1 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign in
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

export default Register;
