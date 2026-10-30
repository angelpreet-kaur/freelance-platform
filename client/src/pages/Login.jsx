import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-animated min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="animate-float absolute -top-20 -left-20 w-72 h-72 bg-pink-400/40 rounded-full blur-3xl"></div>
      <div className="animate-float-slow absolute -bottom-24 -right-16 w-80 h-80 bg-cyan-300/40 rounded-full blur-3xl"></div>

      <form
        onSubmit={handleSubmit}
        className="glass animate-fade-up relative z-10 p-8 rounded-3xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">Welcome Back 👋</h1>
        <p className="text-center text-white/70 text-sm">
          Login to continue to your account
        </p>

        {error && (
          <p className="bg-red-500/30 border border-red-300/50 text-sm rounded-lg px-3 py-2">
            {error}
          </p>
        )}

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

        <button className="btn-main">Login</button>

        <p className="text-sm text-center text-white/80">
          No account?{" "}
          <Link to="/signup" className="font-semibold underline hover:text-yellow-200">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}