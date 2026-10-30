import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/signup", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const roleBtn = (value, label) => (
    <button
      type="button"
      onClick={() => setForm({ ...form, role: value })}
      className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
        form.role === value
          ? "bg-white text-purple-700 border-white scale-105 shadow-lg"
          : "bg-white/10 border-white/30 text-white hover:bg-white/20"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-animated min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="animate-float absolute -top-20 -right-20 w-72 h-72 bg-yellow-300/40 rounded-full blur-3xl"></div>
      <div className="animate-float-slow absolute -bottom-24 -left-16 w-80 h-80 bg-pink-400/40 rounded-full blur-3xl"></div>

      <form
        onSubmit={handleSubmit}
        className="glass animate-fade-up relative z-10 p-8 rounded-3xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">Create Account 🚀</h1>
        <p className="text-center text-white/70 text-sm">
          Join the freelancing platform
        </p>

        {error && (
          <p className="bg-red-500/30 border border-red-300/50 text-sm rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input"
          required
        />

        <div className="flex gap-3">
          {roleBtn("freelancer", "💼 Freelancer")}
          {roleBtn("client", "🧑‍💻 Client")}
        </div>

        <button className="btn-main">Sign up</button>

        <p className="text-sm text-center text-white/80">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold underline hover:text-yellow-200">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}