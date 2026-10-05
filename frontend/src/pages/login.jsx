import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import logo from "../assets/mipt-logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await loginUser(email, password);

    if (!result.success) {
      alert(result.message);
      return;
    }

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Decorative shapes */}
      <div className="absolute -left-20 -bottom-20 w-64 h-64 border-[20px] border-[#dce4ed] rotate-45 opacity-70"></div>

      <div className="absolute -right-24 -top-20 w-64 h-64 border-[20px] border-[#f8d9c8] rotate-45 opacity-70"></div>

      <div className="w-full max-w-[414px] relative z-10">

        {/* MIPT Logo */}
        <div className="flex justify-center mb-9">
          <img
            src={logo}
            alt="MIPT PR Package Tracker"
          className="w-full max-w-[280px] h-auto"
          />
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#d9e0e7] rounded-[5px] shadow-[0_2px_8px_rgba(16,47,71,0.08)] px-7 py-7">

          <div className="mb-6">
            <h2 className="text-[25px] leading-tight font-bold text-[#102f47]">
              Welcome Back
            </h2>

            <p className="mt-1.5 text-[12px] text-[#8190a0]">
              Sign in to manage your PR packages and content deadlines.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-1.5 text-[11px] font-semibold text-[#19344b]"
              >
                Email Address <span className="text-[#e54b35]">*</span>
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[37px] rounded-[4px] border border-[#d7dfe7] bg-white px-3 text-[11px] text-[#19344b] outline-none placeholder:text-[#a8b3bf] focus:border-[#f26a21] focus:ring-1 focus:ring-[#f8d9c8]"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-1.5 text-[11px] font-semibold text-[#19344b]"
              >
                Password <span className="text-[#e54b35]">*</span>
              </label>

              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[37px] rounded-[4px] border border-[#d7dfe7] bg-white px-3 pr-10 text-[11px] text-[#19344b] outline-none placeholder:text-[#a8b3bf] focus:border-[#f26a21] focus:ring-1 focus:ring-[#f8d9c8]"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718398]">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              className="w-full h-[34px] rounded-[4px] bg-[#f26a21] text-white text-[11px] font-semibold transition hover:bg-[#df5c18] active:scale-[0.99]"
            >
              Sign In
            </button>

          </form>

          {/* Register */}
          <p className="mt-5 text-center text-[11px] text-[#7f8d9c]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-[#16859b] hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;