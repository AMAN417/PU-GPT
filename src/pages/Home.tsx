import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold">
          Punjabi University AI Assistant
        </h1>

        <p className="mt-6 text-xl text-gray-400">
          Ask anything about Admissions, Courses, Faculty,
          Placements, Hostels and more.
        </p>

        <button className="mt-10 bg-blue-600 px-8 py-4 rounded-xl text-lg hover:bg-blue-700">
          Start Chat
        </button>
      </main>
    </>
  );
}

export default Home;