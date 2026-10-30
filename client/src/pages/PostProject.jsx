import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function PostProject() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    skills: "",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (form.deadline) payload.deadline = form.deadline;

      await api.post("/projects", payload);
      navigate("/projects");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-animated min-h-screen relative overflow-hidden pb-16">
      <div className="animate-float absolute top-20 left-0 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl"></div>
      <div className="animate-float-slow absolute bottom-10 right-0 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl"></div>

      <Navbar />

      <div className="relative z-10 max-w-xl mx-auto px-6 pt-10">
        {!user || user.role !== "client" ? (
          <div className="glass rounded-3xl p-8 text-center animate-fade-up">
            <p>Only clients can post projects.</p>
            <Link to="/login" className="underline font-semibold">
              Login as a client
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-8 space-y-4 animate-fade-up"
          >
            <h1 className="text-3xl font-bold text-center">Post a Project 📝</h1>

            {error && (
              <p className="bg-red-500/30 border border-red-300/50 text-sm rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <input
              name="title"
              placeholder="Project title"
              value={form.title}
              onChange={handleChange}
              className="input"
              required
            />
            <textarea
              name="description"
              placeholder="Describe your project"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="input"
              required
            />
            <input
              name="budget"
              type="number"
              placeholder="Budget (₹)"
              value={form.budget}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              name="skills"
              placeholder="Skills (comma separated: React, Node)"
              value={form.skills}
              onChange={handleChange}
              className="input"
            />
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              className="input"
            />

            <button className="btn-main" disabled={loading}>
              {loading ? "Posting..." : "Post Project"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}