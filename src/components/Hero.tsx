import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">

      <div className="ai-glow"></div>

      <motion.div
        className="text-center max-w-5xl px-6 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

        <h1 className="text-6xl font-extrabold leading-tight">
          Your AI Assistant for
          <br />
          <span className="text-blue-500">
            Punjabi University
          </span>
        </h1>

        <p className="text-gray-400 text-xl mt-8">
          Ask anything about admissions, hostels,
          courses, placements, scholarships,
          faculty and university notices.
        </p>

        <div className="mt-10 flex justify-center gap-5">

          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg">
            Start Chat
          </button>

          <button className="border border-gray-600 px-8 py-4 rounded-xl hover:bg-gray-800">
            Explore Campus
          </button>

        </div>

      </motion.div>

    </section>
  );
}

export default Hero;