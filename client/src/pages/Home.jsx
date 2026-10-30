import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const features = [
    { icon: "📝", title: "Post Projects", text: "Clients can post jobs in minutes." },
    { icon: "🔍", title: "Find Work", text: "Freelancers browse and search projects." },
    { icon: "🤝", title: "Send Proposals", text: "Bid on projects and get hired." },
  ];

  return (
    <div className="bg-animated min-h-screen relative overflow-hidden">
      <div className="animate-float absolute top-10 left-10 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl"></div>
      <div className="animate-float-slow absolute bottom-10 right-10 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl"></div>

      <Navbar />

      <section className="relative z-10 text-center px-6 pt-20 pb-12 animate-fade-up">
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
          Find the perfect <span className="gradient-text">freelancer</span>
          <br />
          for your next project
        </h1>
        <p className="mt-5 text-white/80 max-w-xl mx-auto">
          Hire talented people or find work you love, all in one place.
        </p>
        {user && <p className="mt-4 text-lg">Welcome back, {user.name} 👋</p>}

        <button
          onClick={() => navigate("/projects")}
          className="btn-main !w-auto px-8 mt-8"
        >
          Browse Projects
        </button>
      </section>

      <section className="relative z-10 grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 pb-16">
        {features.map((f) => (
          <div
            key={f.title}
            className="glass rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-3 hover:bg-white/20 hover:shadow-2xl cursor-pointer"
          >
            <div className="text-5xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-bold">{f.title}</h3>
            <p className="text-sm text-white/75 mt-1">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}