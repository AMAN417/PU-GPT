import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

type Notice = {
  title: string;
  date: string;
  academicSession: string;
  category: string;
  programme: string;
  status: string;
  importantDate: string;
  summary: string;
  source: string;
  file: string;
};

type NoticesResponse = {
  count: number;
  current: number;
  expired: number;
  upcoming: number;
  notices: Notice[];
};

function Notices() {
  const [data, setData] = useState<NoticesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"ALL" | "CURRENT" | "UPCOMING" | "EXPIRED">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  useEffect(() => {
    async function fetchNotices() {
      try {
        const response = await fetch(`${API_BASE_URL}/notices`);
        if (!response.ok) {
          throw new Error("Failed to fetch notices");
        }
        const jsonData: NoticesResponse = await response.json();
        setData(jsonData);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching notices.");
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  const filteredNotices = data?.notices.filter((notice) => {
    const matchesStatus = filter === "ALL" || notice.status.toUpperCase() === filter;
    const matchesCategory = categoryFilter === "ALL" || notice.category.toUpperCase() === categoryFilter;
    return matchesStatus && matchesCategory;
  }) || [];

  const categories = Array.from(new Set(data?.notices.map(n => n.category.toUpperCase()).filter(c => c && c !== "NOT SPECIFIED") || []));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">University <span className="text-blue-500">Notices</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Stay updated with the latest announcements, admission details, and campus news from Punjabi University.</p>
          </header>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-6 rounded-xl text-center max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-2">Could not load notices</h2>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="flex flex-wrap gap-2">
                  {(["ALL", "CURRENT", "UPCOMING", "EXPIRED"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        filter === status 
                          ? "bg-blue-600 text-white" 
                          : "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-200"
                      }`}
                    >
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>

                {categories.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">Category:</span>
                    <select 
                      value={categoryFilter} 
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">All Categories</option>
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Notice List */}
              {filteredNotices.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                  <p className="text-gray-400 text-xl">No notices found matching your filters.</p>
                  <button 
                    onClick={() => { setFilter("ALL"); setCategoryFilter("ALL"); }}
                    className="mt-4 text-blue-500 hover:text-blue-400"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredNotices.map((notice, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition relative overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-100">{notice.title || "Untitled Notice"}</h2>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                            {notice.date && notice.date !== "Not specified" && (
                              <span className="text-blue-400 flex items-center gap-1">
                                📅 {notice.date}
                              </span>
                            )}
                            {notice.academicSession && notice.academicSession !== "Not specified" && (
                              <span className="text-gray-400 bg-slate-800 px-2 py-0.5 rounded">
                                Session: {notice.academicSession}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {notice.category && notice.category !== "Not specified" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-gray-300 border border-slate-700">
                              {notice.category}
                            </span>
                          )}
                          {notice.status && notice.status !== "Not specified" && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              notice.status.toUpperCase() === "CURRENT" ? "bg-green-900/30 text-green-400 border-green-800" :
                              notice.status.toUpperCase() === "EXPIRED" ? "bg-red-900/30 text-red-400 border-red-800" :
                              notice.status.toUpperCase() === "UPCOMING" ? "bg-blue-900/30 text-blue-400 border-blue-800" :
                              "bg-slate-800 text-gray-300 border-slate-700"
                            }`}>
                              {notice.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>

                      {notice.summary && notice.summary !== "Not specified" && (
                        <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800/50">
                          <p className="text-gray-300 whitespace-pre-wrap">{notice.summary}</p>
                        </div>
                      )}

                      {notice.importantDate && notice.importantDate !== "Not specified" && (
                        <div className="mt-4 text-sm text-amber-400 flex items-center gap-2">
                          <span>⚠️ Important Date: {notice.importantDate}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Notices;
