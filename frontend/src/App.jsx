import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Shipments from "./pages/shipments";
import AddShipment from "./pages/addShipment";
import ShipmentDetail from "./pages/shipmentDetail";
import ContentDeadlines from "./pages/contentDeadlines";
import AddContentDeadline from "./pages/addContentDeadline";
import Search from "./pages/search";
import { Router } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/shipments" element={<Shipments />} />

        <Route path="/shipments/:id" element={<ShipmentDetail />} />

        <Route path="/shipments/add" element={<AddShipment />} />

        <Route path="/deadlines" element={<ContentDeadlines />} />

        <Route path="/deadlines/add" element={<AddContentDeadline />} />

        <Route path="/search" element={<Search />} />

        <Route path="/profile" element={<Profile />} />

        {/* Default Page */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


