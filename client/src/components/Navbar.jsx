import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClass =
    "px-3 py-2 rounded-xl text-sm hover:bg-white/20 transition-all hover:scale-105";

  return (
    <nav className="glass relative z-20 flex flex-wrap items-center justify-between gap-3 px-6 py-4 mx-4 mt-4 rounded-2xl">
      <Link to="/" className="text-xl font-bold">
        ⚡ FreelanceHub
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Link to="/" className={linkClass}>
          Home
        </Link>
        <Link to="/projects" className={linkClass}>
          Projects
        </Link>

        {user?.role === "client" && (
          <>
            <Link to="/post-project" className={linkClass}>
              Post Project
            </Link>
            <Link to="/dashboard" className={linkClass}>
              Dashboard
            </Link>
          </>
        )}

        {user?.role === "freelancer" && (
          <Link to="/my-proposals" className={linkClass}>
            My Proposals
          </Link>
        )}

        {user ? (
          <>
            <span className="text-sm text-white/80 px-2 hidden sm:block">
              {user.name} ({user.role})
            </span>
            <button
              onClick={logout}
              className="bg-white/20 hover:bg-red-500 px-4 py-2 rounded-xl text-sm transition-all hover:scale-105"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={linkClass}>
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-xl text-sm transition-all hover:scale-105"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}