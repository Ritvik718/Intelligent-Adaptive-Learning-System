import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Landing from "./pages/Landing";
import Learning from "./pages/Learning";
import DashboardPage from "./pages/DashboardPage";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-9 py-4 backdrop-blur-lg bg-slate-900/60 border-b border-white/10">
        <div className="font-bold tracking-wide text-indigo-400">IALS</div>

        <div className="flex gap-7 text-sm text-slate-200">
          <Link to="/" className="hover:text-indigo-400 transition">
            Home
          </Link>

          <Link to="/learning" className="hover:text-indigo-400 transition">
            Learning
          </Link>

          <Link to="/dashboard" className="hover:text-indigo-400 transition">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
