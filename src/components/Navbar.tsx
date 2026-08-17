import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function goToChat(query: string) {
    navigate(`/chat?query=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="text-3xl font-bold text-blue-500"
        >
          🎓 PU-GPT
        </Link>


        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-gray-300">

          <li>
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
          </li>

          <li>
            <Link to="/notices" className="hover:text-blue-400 transition-colors">
              Notices
            </Link>
          </li>

          <li>
            <button
              onClick={() => goToChat("Tell me about admissions at Punjabi University")}
              className="hover:text-blue-400 cursor-pointer transition-colors"
            >
              Admissions
            </button>
          </li>

          <li>
            <button
              onClick={() => goToChat("What courses are available at Punjabi University?")}
              className="hover:text-blue-400 cursor-pointer transition-colors"
            >
              Courses
            </button>
          </li>

          <li>
            <button
              onClick={() => goToChat("Tell me about departments at Punjabi University")}
              className="hover:text-blue-400 cursor-pointer transition-colors"
            >
              Departments
            </button>
          </li>

          <li>
            <button
              onClick={() => goToChat("Tell me about placements at Punjabi University")}
              className="hover:text-blue-400 cursor-pointer transition-colors"
            >
              Placements
            </button>
          </li>

        </ul>


        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-3">

          <Link to="/login">
            <button className="px-5 py-2 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition">
              Login
            </button>
          </Link>

          <Link to="/chat">
            <button className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition">
              Start Chat
            </button>
          </Link>

        </div>


        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-gray-300 transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-gray-300 transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-gray-300 transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>

      </div>


      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-8 py-6 flex flex-col gap-4">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-300 hover:text-blue-400 transition-colors py-2"
          >
            Home
          </Link>

          <Link
            to="/notices"
            onClick={() => setMenuOpen(false)}
            className="text-gray-300 hover:text-blue-400 transition-colors py-2"
          >
            Notices
          </Link>

          <button
            onClick={() => goToChat("Tell me about admissions at Punjabi University")}
            className="text-left text-gray-300 hover:text-blue-400 transition-colors py-2"
          >
            Admissions
          </button>

          <button
            onClick={() => goToChat("What courses are available at Punjabi University?")}
            className="text-left text-gray-300 hover:text-blue-400 transition-colors py-2"
          >
            Courses
          </button>

          <button
            onClick={() => goToChat("Tell me about departments at Punjabi University")}
            className="text-left text-gray-300 hover:text-blue-400 transition-colors py-2"
          >
            Departments
          </button>

          <button
            onClick={() => goToChat("Tell me about placements at Punjabi University")}
            className="text-left text-gray-300 hover:text-blue-400 transition-colors py-2"
          >
            Placements
          </button>

          <div className="flex gap-3 pt-2 border-t border-slate-800 mt-2">

            <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1">
              <button className="w-full px-5 py-2.5 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition">
                Login
              </button>
            </Link>

            <Link to="/chat" onClick={() => setMenuOpen(false)} className="flex-1">
              <button className="w-full px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition">
                Start Chat
              </button>
            </Link>

          </div>

        </div>
      )}

    </nav>
  );
}

export default Navbar;