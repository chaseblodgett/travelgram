import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setError(null);
      onLogin(data.user.id);
      console.log(data.user.id);
      console.log("Login Successful");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-black px-4 font-sans">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl p-8 animate-fade-in-up border border-gray-800">
        <h2 className="text-3xl font-bold text-purple-400 text-center mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm text-purple-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm text-purple-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition transform hover:scale-105 shadow-md"
          >
            Login
          </button>
        </form>

        {/* Error Placeholder */}
        {/* <p className="text-red-500 text-center mt-4">Invalid login details.</p> */}

        {/* Register Link */}
        <p className="mt-6 text-sm text-gray-400 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 transition">
            Sign up
          </Link>
        </p>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out both;
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
