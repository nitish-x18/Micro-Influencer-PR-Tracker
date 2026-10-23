import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#f6f8fa]">
      {/* Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Page */}
        <main className="min-w-0 flex-1">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard application */}
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;