import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/projects", {
        params: query ? { search: query } : {},
      });
      setProjects(data.projects);
    } catch (err) {
      setError("Could not load projects. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProjects(search);
  };

  return (
    <div className="bg-animated min-h-screen relative overflow-hidden pb-16">
      <div className="animate-float absolute top-20 left-0 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl"></div>
      <div className="animate-float-slow absolute bottom-10 right-0 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl"></div>

      <Navbar />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-10">
        <h1 className="text-4xl font-extrabold text-center animate-fade-up">
          Browse <span className="gradient-text">Projects</span>
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex gap-3 mt-8 max-w-xl mx-auto"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="input"
          />
          <button className="btn-main !w-auto px-6">Search</button>
        </form>

        {loading && <p className="text-center mt-10">Loading...</p>}
        {error && (
          <p className="text-center mt-10 bg-red-500/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {!loading && !error && projects.length === 0 && (
          <p className="text-center mt-10 text-white/80">
            No projects found.
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-6 mt-10">
          {projects.map((p) => (
            <Link
              to={`/projects/${p._id}`}
              key={p._id}
              className="glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-white/20 hover:shadow-2xl animate-fade-up block"
            >
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="text-sm text-white/75 mt-2 line-clamp-2">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {p.skills?.map((s) => (
                  <span
                    key={s}
                    className="bg-white/20 text-xs px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-5 text-sm">
                <span className="font-bold text-yellow-200">
                  ₹{p.budget}
                </span>
                <span className="text-white/70">
                  by {p.client?.name || "Client"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}