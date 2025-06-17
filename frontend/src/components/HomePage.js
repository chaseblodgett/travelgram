import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView, InView} from 'react-intersection-observer';
import FeatureShowcase from "./FeatureShowcase";

const features = [
    {
        video: "/browse_posts.mp4",
        caption: {
          title: "See Your Journey on the Map",
          description: "Watch your travels come to life with a dynamic, interactive map. Trace your routes, revisit past destinations, and get a visual overview of everywhere you've explored.",
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
        video: "/create_trip_new.mp4",
        caption: {
          title: "Create and Customize Trips",
          description:"Easily plan new journeys by adding destinations, dates, notes, and photos to craft the perfect travel itinerary.",
        },
      },
      
      {
        video: "/add_itinerary.mp4",
        caption: {
          title: "Save It for Later",
          description: "Add destinations and experiences to your personal bucket list with just one tap. Keep track of dream locations and plan future adventures with ease.",
        },
      },
      {
        video: "/explore_chat.mp4",
        caption: {
          title: "Plan Trips Together",
          description: "Message friends directly to share ideas, coordinate plans, or just hype up your next getaway. Collaborate in real-time and turn casual chats into unforgettable adventures.",
        },
      }
      
  ];

export default function HomePage() {
  const cardsRef = useRef([]);
  const [visibleSections, setVisibleSections] = useState([]);

  const { ref, inView } = useInView({
    threshold: 0.2,
  });

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
    <div className="min-h-screen bg-gradient-to-br from-[#1a0e2a] via-[#120d26] to-[#000000] text-white font-inter ">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 fixed top-0 left-0 right-0 z-50 bg-opacity-90 font-sans">
        <div className="flex items-center space-x-2 text-purple-400 text-xl font-bold font-sans">
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
      <section className="flex flex-col items-center gap-12 px-6 pb-20">
        {features.map((feature, idx) => (
            <>
            <InView
                threshold={0.4}
                onChange={(inView) => {
                if (inView) {
                    setVisibleSections((prev) =>
                    prev.includes(idx) ? prev : [...prev, idx]
                    );
                }
                }}
            >
                {({ ref }) => (
                <div
                    ref={ref}
                    className={`transform transition-all duration-700 ease-out w-full max-w-5xl mx-auto ${
                        visibleSections.includes(idx)
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-10"
                      }`}
                >
                    <FeatureShowcase
                    videoSrc={feature.video}
                    caption={feature.caption}
                    side={idx % 2 === 0}
                    />
                </div>
                )}
            </InView>

            {(idx + 1) % 2 === 0 && idx < features.length - 1 && (
                <div className="text-center text-3xl md:text-4xl font-bold text-purple-300 py-12 font-inter">
                {idx === 1
                    ? "Dream. Discover. Document."
                    : "Plan Smarter. Travel Better."}
                </div>
            )}
            </>
        ))}
        </section>

    </div>
  );
}
