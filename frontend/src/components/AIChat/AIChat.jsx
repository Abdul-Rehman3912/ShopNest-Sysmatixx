import React, { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../libs/axios";
import ProductCard from "./ProductCard";
import { MessageSquare, X, Send } from "lucide-react";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { user } = useContext(AuthContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    if (!user) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "ai",
          text: "⚠️ Please login to use the AI search feature!",
          isError: true,
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        text: trimmedQuery,
      },
    ]);

    setQuery("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/api/ai/search",
        { query: trimmedQuery },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      const data = response.data;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "ai",
          text: data.message,
          products: data.products || [],
          keywords: data.keywords || [],
          total: data.total || 0,
        },
      ]);
    } catch (error) {
      console.error("Search error:", error);
      if (error.response?.status === 401) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "ai",
            text: "⚠️ Your session has expired. Please login again!",
            isError: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "ai",
            text:
              error.response?.data?.message ||
              "❌ Sorry, something went wrong. Please try again!",
            isError: true,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (suggestion) => {
    setQuery(suggestion);
    setTimeout(() => {
      const form = document.getElementById("floating-ai-form");
      if (form) form.requestSubmit();
    }, 50);
  };

  const suggestions = [
    "Running shoes under $100",
    "Gaming laptop",
    "Blue jeans",
    "Wireless headphones",
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 font-sans text-white sm:bottom-6 sm:left-6 sm:right-auto">
      {isOpen && (
        <div className="absolute bottom-20 left-0 right-0 h-[min(580px,calc(100vh-7rem))] w-full bg-[#18181b] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out transform origin-bottom-left animate-in fade-in slide-in-from-bottom-4 sm:right-auto sm:w-[400px] sm:max-w-[calc(100vw-2rem)]">
          <div className="px-5 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="font-bold text-base tracking-wide">
                  AI Product Finder
                </h3>
                <p className="text-xs text-indigo-200">
                  {user ? "Online & ready" : "Authentication needed"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#09090b]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-5">
                <div className="text-4xl mb-3">🛍️</div>
                <h4 className="text-md font-semibold text-slate-200 mb-1">
                  {user ? "Find products naturally" : "Login Required"}
                </h4>
                <p className="text-slate-400 text-xs max-w-xs mb-4">
                  {user
                    ? "Describe what you want in your own words, and I'll look up matching items."
                    : "Please sign into your profile to search using AI."}
                </p>
                {user && (
                  <div className="flex flex-col gap-2 w-full px-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(suggestion)}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700 transition-colors"
                      >
                        ⚡ "{suggestion}"
                      </button>
                    ))}
                  </div>
                )}
                {!user && (
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Login to Continue
                  </button>
                )}
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl break-words shadow-sm text-sm ${msg.isError ? "bg-red-900/40 text-red-200 border border-red-800" : msg.type === "user" ? "bg-indigo-600 text-white rounded-br-none" : "bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-none"}`}
                  >
                    <div className="leading-relaxed">{msg.text}</div>

                    {msg.keywords && msg.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] rounded-md px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300"
                          >
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    )}

                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80">
                        <div className="text-[11px] font-semibold text-slate-400 mb-2">
                          Found {msg.total} products:
                        </div>
                        <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1 sm:grid-cols-2">
                          {msg.products.slice(0, 4).map((product) => (
                            <div
                              key={product._id}
                              className="transform scale-[0.9] origin-top-left -mr-4 -mb-4"
                            >
                              <ProductCard product={product} />
                            </div>
                          ))}
                        </div>
                        {msg.products.length > 4 && (
                          <button
                            className="mt-2 text-xs text-indigo-400 hover:underline block"
                            onClick={() => (window.location.href = "/shop")}
                          >
                            View all {msg.products.length} products →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl w-fit">
                <div className="flex gap-1">
                  <span className="block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                  <span className="block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-xs text-slate-400">
                  Searching inventory...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            id="floating-ai-form"
            onSubmit={handleSearch}
            className="flex gap-2 p-3 border-t border-slate-800 bg-[#121214]"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                user
                  ? "Describe what you're looking for..."
                  : "Please login to search"
              }
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-500"
              disabled={loading || !user}
            />
            <button
              type="submit"
              disabled={loading || !query.trim() || !user}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl p-2 flex items-center justify-center transition-colors disabled:bg-slate-800 disabled:text-slate-600"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-slate-800 hover:bg-slate-700 rotate-90 border border-slate-700"
            : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 shadow-indigo-600/20"
        }`}
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>
    </div>
  );
};

export default AIChat;