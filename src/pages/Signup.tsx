import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSignup() {
    setError("");

    if (!name.trim() || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("pu-gpt-user", email);
      setLoading(false);
      navigate("/chat");
    }, 1000);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSignup();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >

        <h1 className="text-4xl font-bold text-center text-blue-500 mb-2">
          🎓 PU-GPT
        </h1>

        <p className="text-center text-gray-400 mb-8 text-sm">
          Create your account to get started
        </p>

        {error && (
          <p className="text-red-400 text-center mb-4 text-sm">
            {error}
          </p>
        )}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Full Name"
          className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mb-4 outline-none text-white focus:border-blue-500 transition-colors"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Email address"
          type="email"
          className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mb-4 outline-none text-white focus:border-blue-500 transition-colors"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Password (min. 6 characters)"
          type="password"
          className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mb-6 outline-none text-white focus:border-blue-500 transition-colors"
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </motion.div>

    </div>
  );
}

export default Signup;