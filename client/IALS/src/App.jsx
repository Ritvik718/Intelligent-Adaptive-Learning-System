import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Landing from "./pages/Landing";
import Learning from "./pages/Learning";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav
        style={{
          padding: "12px 20px",
          display: "flex",
          gap: "20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/learning">Learning</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
