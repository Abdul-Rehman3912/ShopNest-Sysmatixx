import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../libs/axios";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      const data = res.data;

      login(data);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#18181b] p-6 rounded-xl shadow-2xl border border-white/5 flex flex-col gap-4 sm:p-10"
      >
        <h2 className="text-2xl font-bold text-white text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-3 rounded-lg bg-[#09090b] border border-slate-700 text-white outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded-lg bg-[#09090b] border border-slate-700 text-white outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className={`mt-2 px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-95"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Logging in...</span>
            </>
          ) : (
            "LogIn"
          )}
        </button>

        <p className="text-center text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
