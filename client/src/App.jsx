import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import PostProject from "./pages/PostProject";
import ClientDashboard from "./pages/ClientDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/post-project" element={<PostProject />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}