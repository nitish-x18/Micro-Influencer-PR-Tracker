import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing.jsx";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Brands from "../pages/Brands.jsx";
import Products from "../pages/Products.jsx";
import Shipments from "../pages/Shipments.jsx";
import Deadlines from "../pages/Deadlines.jsx";

import Sidebar from "../components/sidebar.jsx";
import Topbar from "../components/topbar.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#f6f8fa]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

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
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/products" element={<Products />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/deadlines" element={<Deadlines />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;