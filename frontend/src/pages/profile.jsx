import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Jane Doe",
    email: "jane@example.com",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "JD";

  return (
    <div className="min-h-screen bg-[#f3f6fa]">
      <main className="min-h-screen min-w-0">
        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-7">

          {/* Page Heading */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
            <div>
              <h1 className="m-0 text-[27px] sm:text-[31px] leading-[38px] font-bold text-[#10243e]">
                My Profile
              </h1>

              <p className="m-0 mt-1 text-[13px] sm:text-[14px] text-[#536a81]">
                View and manage your account information.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center text-[12px] sm:text-[11px] text-[#2870a8] hover:text-[#e96a28] transition"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Profile Card */}
          <div className="w-full max-w-[700px] bg-white border border-[#e5e7eb] rounded-[10px] p-6 sm:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">

            {/* Avatar */}
            <div className="w-[80px] h-[80px] rounded-full bg-[#172554] text-white flex items-center justify-center text-[26px] font-bold mb-[18px]">
              {initials}
            </div>

            {/* User Information */}
            <div>
              <h2 className="m-0 mb-1.5 text-[24px] font-bold text-[#111827]">
                {user.name}
              </h2>

              <p className="m-0 text-[14px] text-[#6b7280]">
                {user.email}
              </p>
            </div>

            {/* Profile Details */}
            <div className="mt-[30px] border-t border-[#e5e7eb] pt-[22px]">

              {/* Full Name */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4 border-b border-[#f0f0f0]">
                <span className="text-[14px] text-[#6b7280]">
                  Full Name
                </span>

                <strong className="text-[15px] text-[#111827] break-all">
                  {user.name}
                </strong>
              </div>

              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4 border-b border-[#f0f0f0]">
                <span className="text-[14px] text-[#6b7280]">
                  Email Address
                </span>

                <strong className="text-[15px] text-[#111827] break-all">
                  {user.email}
                </strong>
              </div>

            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-7 px-[22px] py-[11px] border-0 rounded-[8px] bg-[#dc2626] text-white text-[14px] font-semibold hover:bg-[#b91c1c] transition"
            >
              Logout
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;