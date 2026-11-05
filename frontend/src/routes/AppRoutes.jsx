import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Brands from "../pages/Brands";
import Products from "../pages/Products";
import Shipments from "../pages/Shipments";
import Deadlines from "../pages/Deadlines";

import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";

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
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/products" element={<Products />} />
        <Route path="/shipments" element={<Shipments />} />
        <Route path="/deadlines" element={<Deadlines />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;