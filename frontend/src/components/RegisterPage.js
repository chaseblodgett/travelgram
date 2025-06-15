import React, { useState } from "react";

const RegisterPage = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setError(null);
      setSuccess(true);
      onRegister(data.userId);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-black px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-purple-400 text-center mb-8">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">

          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm text-purple-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

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

          {/* Profile Picture Upload */}
          <div className="flex flex-col">
            <label htmlFor="profilePicture" className="text-sm text-purple-300 mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="file:bg-purple-600 file:text-white file:rounded-lg file:px-4 file:py-2 file:border-0 file:cursor-pointer text-sm text-gray-300 hover:file:bg-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition transform hover:scale-105 shadow-md"
          >
            Register
          </button>
        </form>

        {success && (
            <p className="mt-4 text-green-600 text-center">Registration successful!</p>
          )}
          {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
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

export default RegisterPage;
