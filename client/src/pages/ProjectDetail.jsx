import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function ProjectDetail() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ coverLetter: "", bidAmount: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data);
      } catch {
        setError("Project not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    try {
      await api.post("/proposals", {
        projectId: id,
        coverLetter: form.coverLetter,
        bidAmount: Number(form.bidAmount),
      });
      setMsg({ type: "success", text: "Proposal sent successfully!" });
      setForm({ coverLetter: "", bidAmount: "" });
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="bg-animated min-h-screen relative overflow-hidden pb-16">
      <div className="animate-float absolute top-20 left-0 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl"></div>
      <div className="animate-float-slow absolute bottom-10 right-0 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl"></div>

      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-10">
        <Link to="/projects" className="text-sm text-white/80 hover:text-white">
          ← Back to projects
        </Link>

        {loading && <p className="text-center mt-10">Loading...</p>}
        {error && (
          <p className="text-center mt-10 bg-red-500/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {project && (
          <>
            <div className="glass rounded-3xl p-8 mt-6 animate-fade-up">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-extrabold">{project.title}</h1>
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full capitalize whitespace-nowrap">
                  {project.status}
                </span>
              </div>

              <p className="mt-4 text-white/85 whitespace-pre-line">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-5">
                {project.skills?.map((s) => (
                  <span
                    key={s}
                    className="bg-white/20 text-xs px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
                <div>
                  <p className="text-white/60">Budget</p>
                  <p className="font-bold text-yellow-200 text-lg">
                    ₹{project.budget}
                  </p>
                </div>
                <div>
                  <p className="text-white/60">Deadline</p>
                  <p className="font-semibold">
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-white/60">Posted by</p>
                  <p className="font-semibold">{project.client?.name}</p>
                </div>
              </div>
            </div>

            {/* Proposal section */}
            <div className="glass rounded-3xl p-8 mt-6 animate-fade-up">
              {!user && (
                <p className="text-center">
                  <Link to="/login" className="underline font-semibold">
                    Login
                  </Link>{" "}
                  as a freelancer to send a proposal.
                </p>
              )}

              {user && user.role === "client" && (
                <p className="text-center text-white/80">
                  Only freelancers can send proposals.
                </p>
              )}

              {user && user.role === "freelancer" && project.status === "open" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold">Send a Proposal</h2>

                  {msg.text && (
                    <p
                      className={`text-sm rounded-lg px-3 py-2 border ${
                        msg.type === "success"
                          ? "bg-green-500/30 border-green-300/50"
                          : "bg-red-500/30 border-red-300/50"
                      }`}
                    >
                      {msg.text}
                    </p>
                  )}

                  <textarea
                    name="coverLetter"
                    placeholder="Why are you the right person for this project?"
                    value={form.coverLetter}
                    onChange={handleChange}
                    rows={4}
                    className="input"
                    required
                  />
                  <input
                    name="bidAmount"
                    type="number"
                    placeholder="Your bid amount (₹)"
                    value={form.bidAmount}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                  <button className="btn-main">Send Proposal</button>
                </form>
              )}

              {user &&
                user.role === "freelancer" &&
                project.status !== "open" && (
                  <p className="text-center text-white/80">
                    This project is no longer open.
                  </p>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}