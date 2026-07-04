import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../libs/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      const data = res.data;
      alert(
        "Registration Successful! Please check your email for the Welcome OTP.",
      );
      login(data);
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#18181b] p-6 rounded-xl shadow-2xl border border-white/5 flex flex-col gap-4 sm:p-10"
      >
        <h2 className="text-2xl font-bold text-white text-center">Register</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-4 py-3 rounded-lg bg-[#09090b] border border-slate-700 text-white outline-none"
        />
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
          className="mt-2 px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg font-semibold"
        >
          Register
        </button>
        <p className="text-center text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
