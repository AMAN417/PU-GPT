import { useEffect, useRef, useState } from "react";

type Message = {
  sender: "user" | "ai";
  text: string;
  time: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Chat() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! 👋 I'm PU-GPT, your Punjabi University AI assistant. How can I help you today?",
      time: getTime(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Send message
  async function sendMessage() {
    if (!message.trim() || isLoading) return;

    const userText = message.trim();

    const userMessage: Message = {
      sender: "user",
      text: userText,
      time: getTime(),
    };

    const previousMessages = messages;

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Convert frontend history into backend history
      const history = previousMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: userText,
          history,
        }),
      });

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : { reply: await response.text() };

      if (!response.ok) {
        throw new Error(
          data.reply || "Backend request failed."
        );
      }

      const aiMessage: Message = {
        sender: "ai",
        text: data.reply || "I couldn't generate a response.",
        time: getTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        sender: "ai",
        text:
          error instanceof Error
            ? `⚠️ ${error.message}`
            : "⚠️ Unable to connect to PU-GPT.",
        time: getTime(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  // Start a new conversation
  function newChat() {
    if (isLoading) return;

    setMessages([
      {
        sender: "ai",
        text: "Hello! 👋 I'm PU-GPT, your Punjabi University AI assistant. How can I help you today?",
        time: getTime(),
      },
    ]);

    setMessage("");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 p-6 hidden md:flex flex-col">

        <h1 className="text-3xl font-bold text-blue-500">
          PU-GPT
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Punjabi University AI Assistant
        </p>

        <button
          onClick={newChat}
          className="w-full mt-8 bg-blue-600 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          + New Chat
        </button>

        <div className="mt-8 text-sm text-slate-500">
          <p>University Assistant</p>
          <p className="mt-3">📚 Study</p>
          <p className="mt-2">🎓 University</p>
          <p className="mt-2">📢 Notices</p>
          <p className="mt-2">💰 Scholarships</p>
        </div>

        <div className="mt-auto text-xs text-slate-600">
          PU-GPT v1.0
        </div>
      </aside>

      {/* MAIN CHAT */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="border-b border-slate-800 p-5 flex items-center justify-between">

          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              PU-GPT Assistant
            </h2>

            <p className="text-sm text-slate-500">
              Your university AI assistant
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Online
          </div>

        </header>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[85%] md:max-w-2xl rounded-2xl p-4 ${
                  msg.sender === "user"
                    ? "bg-blue-600"
                    : "bg-slate-900 border border-slate-800"
                }`}
              >

                <div className="flex items-center gap-2 mb-2">

                  <span className="text-xs font-semibold">
                    {msg.sender === "user"
                      ? "You"
                      : "PU-GPT"}
                  </span>

                </div>

                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </p>

                <span className="text-xs text-slate-400 mt-3 block">
                  {msg.time}
                </span>

              </div>

            </div>

          ))}

          {/* LOADING */}
          {isLoading && (

            <div className="flex justify-start">

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">

                <div className="flex items-center gap-2">

                  <span className="text-sm text-slate-400">
                    PU-GPT is thinking
                  </span>

                  <span className="animate-pulse">
                    ●●●
                  </span>

                </div>

              </div>

            </div>

          )}

          <div ref={chatEndRef}></div>

        </div>

        {/* INPUT */}
        <div className="border-t border-slate-800 p-4 md:p-6">

          <div className="max-w-4xl mx-auto">

            <div className="flex items-end bg-slate-900 border border-slate-800 rounded-2xl p-2">

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask PU-GPT anything..."
                rows={1}
                disabled={isLoading}
                className="flex-1 bg-transparent outline-none px-4 py-3 resize-none disabled:opacity-50"
                onKeyDown={(e) => {

                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }

                }}
              />

              <button
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                className="bg-blue-600 px-5 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? "..." : "Send"}
              </button>

            </div>

            <p className="text-xs text-slate-600 text-center mt-3">
              PU-GPT can make mistakes. Verify important university information.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Chat;