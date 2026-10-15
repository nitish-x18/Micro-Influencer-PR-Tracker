import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import logo from "../assets/mipt-logo.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await registerUser(name, email, password, confirmPassword);

    if (!result.success) {
      alert(result.message);
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        name,
        email,
      }),
    );

    alert(result.message);
    navigate("/login");
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

        {/* Register Card */}
        <div className="bg-white border border-[#d9e0e7] rounded-[5px] shadow-[0_2px_8px_rgba(16,47,71,0.08)] px-7 py-7">
          <div className="mb-6">
            <h2 className="text-[25px] leading-tight font-bold text-[#102f47]">
              Create Account
            </h2>

            <p className="mt-1.5 text-[12px] text-[#8190a0]">
              Create your account to start managing your PR packages.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-1.5 text-[11px] font-semibold text-[#19344b]"
              >
                Full Name <span className="text-[#e54b35]">*</span>
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-[37px] rounded-[4px] border border-[#d7dfe7] bg-white px-3 text-[11px] text-[#19344b] outline-none placeholder:text-[#a8b3bf] focus:border-[#f26a21] focus:ring-1 focus:ring-[#f8d9c8]"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
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
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block mb-1.5 text-[11px] font-semibold text-[#19344b]"
              >
                Password <span className="text-[#e54b35]">*</span>
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-[37px] rounded-[4px] border border-[#d7dfe7] bg-white px-3 text-[11px] text-[#19344b] outline-none placeholder:text-[#a8b3bf] focus:border-[#f26a21] focus:ring-1 focus:ring-[#f8d9c8]"
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block mb-1.5 text-[11px] font-semibold text-[#19344b]"
              >
                Confirm Password <span className="text-[#e54b35]">*</span>
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-[37px] rounded-[4px] border border-[#d7dfe7] bg-white px-3 text-[11px] text-[#19344b] outline-none placeholder:text-[#a8b3bf] focus:border-[#f26a21] focus:ring-1 focus:ring-[#f8d9c8]"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full h-[34px] rounded-[4px] bg-[#f26a21] text-white text-[11px] font-semibold transition hover:bg-[#df5c18] active:scale-[0.99]"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-5 text-center text-[11px] text-[#7f8d9c]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#16859b] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
