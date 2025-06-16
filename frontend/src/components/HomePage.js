import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import FeatureShowcase from "./FeatureShowcase";

const features = [
    {
      video: "/create_trip_new.mp4",
      caption: {
        title: "Create and Customize Trips",
        description:"Easily plan new journeys by adding destinations, dates, notes, and photos to craft the perfect travel itinerary.",
      },
    },
    {
        video: "/add_caption.mp4",
        caption: {
          title: "Capture the Moments",
          description: "Bring your destinations to life by adding stories and uploading photos. Share the memories that made your journey unforgettable.",
        },
      },
    
      {
        video: "/browse_friends.mp4",
        caption: {
          title: "Explore Your Travel Circle",
          description: "Scroll through your friends' latest adventures, stories, and snapshots — all in one place. Get inspired by where they’ve been and what they’ve seen.",
        },
      },
      {
        video: "/browse_posts.mp4",
        caption: {
          title: "See Your Journey on the Map",
          description: "Watch your travels come to life with a dynamic, interactive map. Trace your routes, revisit past destinations, and get a visual overview of everywhere you've explored.",
        },
      },
      
      {
        video: "/add_itinerary.mp4",
        caption: {
          title: "Save It for Later",
          description: "Add destinations and experiences to your personal bucket list with just one tap. Keep track of dream locations and plan future adventures with ease.",
        },
      }
      
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

  const { ref, inView, entry } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] via-[#0f0f1a] to-black text-white font-inter">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-90 shadow-md">
        <div className="flex items-center space-x-2 text-purple-400 text-xl font-bold">
          <img src="/travel_logo.svg" alt="Logo" className="h-10 w-10" />
          <span>Travelgram</span>
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
      <section className="flex flex-col items-center gap-10 px-6 pb-20">
      {features.map((feature, idx) => (
          <div
            key={idx}
            ref={ref}
            className="opacity-0 translate-y-10 transition-opacity transition-transform duration-700 ease-out w-full max-w-5xl mx-auto"
          >
            {inView && (<FeatureShowcase
              videoSrc={feature.video}
              caption={feature.caption}
              side={idx % 2 === 0}
            />)}
          </div>
        ))}
        </section>
    </div>
  );
}
