import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const features = [
  "Share your travel stories",
  "See where your friends are going",
  "Upload photos from your trip",
  "Start planning your trip",
  "Check your bucket list off",
];

export default function HomePage() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-90 shadow-md">
        <div className="flex items-center space-x-2 text-purple-400 text-xl font-bold">
          <img src="/travel_logo.svg" alt="Logo" className="h-8 w-8" />
          <span>travelgram</span>
        </div>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-1.5 rounded-md text-sm hover:text-purple-300 transition"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-4 py-1.5 bg-purple-600 rounded-xl text-sm hover:bg-purple-500 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-300 px-4">
          The app for all your travel sharing needs
        </h1>
        <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
          Discover, share, and connect with fellow travelers around the world.
        </p>
      </section>

      {/* Features Section */}
      <section className="flex flex-col items-center space-y-8 px-6 pb-20">
        {features.map((text, idx) => (
          <div
            key={idx}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="w-full max-w-3xl bg-gray-800 border border-gray-700 text-purple-300 p-6 rounded-xl opacity-0 translate-y-10 transition-all duration-700 ease-out"
          >
            <h2 className="text-xl md:text-2xl font-semibold">{text}</h2>
          </div>
        ))}
      </section>
    </div>
  );
}
