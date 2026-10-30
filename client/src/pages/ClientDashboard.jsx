import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function ClientDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState({});
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      const { data } = await api.get("/projects/my");
      setProjects(data.projects);
    } catch {
      setError("Could not load your projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "client") loadProjects();
    else setLoading(false);
  }, []);

  const loadProposals = async (projectId) => {
    try {
      const { data } = await api.get(`/proposals/project/${projectId}`);
      setProposals((prev) => ({ ...prev, [projectId]: data.proposals }));
    } catch {
      setError("Could not load proposals");
    }
  };

  const toggle = (projectId) => {
    if (openId === projectId) {
      setOpenId(null);
    } else {
      setOpenId(projectId);
      loadProposals(projectId);
    }
  };

  const updateStatus = async (proposalId, status, projectId) => {
    try {
      await api.patch(`/proposals/${proposalId}`, { status });
      await loadProposals(projectId);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const statusColor = (s) =>
    s === "accepted"
      ? "bg-green-500/40"
      : s === "rejected"
      ? "bg-red-500/40"
      : "bg-yellow-500/40";

  return (
    <div className="bg-animated min-h-screen relative overflow-hidden pb-16">
      <div className="animate-float absolute top-20 left-0 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl"></div>
      <div className="animate-float-slow absolute bottom-10 right-0 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl"></div>

      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10">
        <h1 className="text-4xl font-extrabold text-center animate-fade-up">
          My <span className="gradient-text">Projects</span>
        </h1>

        {(!user || user.role !== "client") && !loading && (
          <div className="glass rounded-3xl p-8 text-center mt-8">
            <p>Only clients can view this page.</p>
            <Link to="/login" className="underline font-semibold">
              Login as a client
            </Link>
          </div>
        )}

        {error && (
          <p className="mt-6 bg-red-500/30 border border-red-300/50 text-sm rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {loading && <p className="text-center mt-10">Loading...</p>}

        {user?.role === "client" && !loading && projects.length === 0 && (
          <p className="text-center mt-10 text-white/80">
            You have not posted any projects yet.{" "}
            <Link to="/post-project" className="underline font-semibold">
              Post one
            </Link>
          </p>
        )}

        <div className="space-y-6 mt-10">
          {projects.map((p) => (
            <div key={p._id} className="glass rounded-2xl p-6 animate-fade-up">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="text-sm text-white/70 mt-1">
                    Budget:{" "}
                    <span className="text-yellow-200 font-semibold">
                      ₹{p.budget}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-white/20 text-xs px-3 py-1 rounded-full capitalize">
                    {p.status}
                  </span>
                  <button
                    onClick={() => toggle(p._id)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm transition-all hover:scale-105"
                  >
                    {openId === p._id ? "Hide proposals" : "View proposals"}
                  </button>
                </div>
              </div>

              {openId === p._id && (
                <div className="mt-5 space-y-3">
                  {(proposals[p._id] || []).length === 0 && (
                    <p className="text-sm text-white/70">No proposals yet.</p>
                  )}

                  {(proposals[p._id] || []).map((pr) => (
                    <div
                      key={pr._id}
                      className="bg-white/10 rounded-xl p-4 border border-white/20"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold">
                            {pr.freelancer?.name}
                          </p>
                          <p className="text-xs text-white/60">
                            {pr.freelancer?.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-yellow-200">
                            ₹{pr.bidAmount}
                          </span>
                          <span
                            className={`text-xs px-3 py-1 rounded-full capitalize ${statusColor(
                              pr.status
                            )}`}
                          >
                            {pr.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-white/85 mt-3">
                        {pr.coverLetter}
                      </p>

                      {pr.status === "pending" && p.status === "open" && (
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() =>
                              updateStatus(pr._id, "accepted", p._id)
                            }
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(pr._id, "rejected", p._id)
                            }
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}