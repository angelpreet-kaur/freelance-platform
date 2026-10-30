import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function FreelancerDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/proposals/my");
        setProposals(data.proposals);
      } catch {
        setError("Could not load your proposals");
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "freelancer") load();
    else setLoading(false);
  }, []);

  const statusColor = (s) =>
    s === "accepted"
      ? "bg-green-500/40"
      : s === "rejected"
      ? "bg-red-500/40"
      : "bg-yellow-500/40";

  const count = (s) => proposals.filter((p) => p.status === s).length;

  return (
    <div className="bg-animated min-h-screen relative overflow-hidden pb-16">
      <div className="animate-float absolute top-20 left-0 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl"></div>
      <div className="animate-float-slow absolute bottom-10 right-0 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl"></div>

      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10">
        <h1 className="text-4xl font-extrabold text-center animate-fade-up">
          My <span className="gradient-text">Proposals</span>
        </h1>

        {(!user || user.role !== "freelancer") && !loading && (
          <div className="glass rounded-3xl p-8 text-center mt-8">
            <p>Only freelancers can view this page.</p>
            <Link to="/login" className="underline font-semibold">
              Login as a freelancer
            </Link>
          </div>
        )}

        {error && (
          <p className="mt-6 bg-red-500/30 border border-red-300/50 text-sm rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {loading && <p className="text-center mt-10">Loading...</p>}

        {user?.role === "freelancer" && !loading && (
          <>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="glass rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold">{count("pending")}</p>
                <p className="text-xs text-white/70">Pending</p>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold">{count("accepted")}</p>
                <p className="text-xs text-white/70">Accepted</p>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold">{count("rejected")}</p>
                <p className="text-xs text-white/70">Rejected</p>
              </div>
            </div>

            {proposals.length === 0 && (
              <p className="text-center mt-10 text-white/80">
                You have not sent any proposals yet.{" "}
                <Link to="/projects" className="underline font-semibold">
                  Browse projects
                </Link>
              </p>
            )}

            <div className="space-y-4 mt-8">
              {proposals.map((pr) => (
                <div
                  key={pr._id}
                  className="glass rounded-2xl p-6 animate-fade-up"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      {pr.project ? (
                        <Link
                          to={`/projects/${pr.project._id}`}
                          className="text-xl font-bold hover:underline"
                        >
                          {pr.project.title}
                        </Link>
                      ) : (
                        <p className="text-xl font-bold">Project removed</p>
                      )}
                      <p className="text-sm text-white/70 mt-1">
                        Project budget: ₹{pr.project?.budget}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-yellow-200">
                        Your bid: ₹{pr.bidAmount}
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
                  <p className="text-sm text-white/85 mt-3">{pr.coverLetter}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}