import React, { useState, useEffect, useRef } from "react";

const PhotosComponent = ({ photos }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [maxDimensions, setMaxDimensions] = useState({height : 0, width: 0});
  const imageRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!photos || photos.length === 0) return;

    const loadPromises = photos.map((src, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
          imageRefs.current[index] = img;
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };

        img.onerror = () => resolve({ width: 0, height: 0 });
      });
    });

    Promise.all(loadPromises).then((dimensions) => {
      const maxWidth = Math.max(...dimensions.map((d) => d.width));
      const maxHeight = Math.max(...dimensions.map((d) => d.height));
      setMaxDimensions({ width: maxWidth, height: maxHeight });
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640); 
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [photos]);
  

  if (!photos || photos.length === 0) return;

  const handleNextPhoto = () => {
    setPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  return (
    
      <div className="flex flex-col items-center w-full max-w-full text-center mx-auto">
        {/* Image & Side Buttons Container */}
        <div
          className={`relative bg-gray-900 flex items-center justify-center rounded-lg ${
            isMobile
              ? "w-full max-w-[85vw] h-[250px]"
              : "w-[300px] sm:w-[350px] h-[350px] sm:h-[400px]"
          }`}
        >
          {/* Side Buttons for Desktop */}
          {!isMobile && (
              <button
                onClick={handlePrevPhoto}
                className="absolute left-[-50px] top-1/2 transform -translate-y-1/2 p-2 bg-transparent rounded-lg shadow-lg transition-all"
                aria-label="Previous Photo"
              >
                <img
                  src="arrow_back.svg"
                  alt="Back"
                  className="w-5 h-5 transition-transform duration-200 transform hover:scale-110"
                />

              </button>
            )}

    
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src={photos[photoIndex]}
              alt={`photo-${photoIndex}`}
              className="w-full h-full object-cover"
            />
          </div>

    
          {!isMobile && (
              <button
                onClick={handleNextPhoto}
                className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 p-2 bg-transparent rounded-lg shadow-lg transition-all"
                aria-label="Previous Photo"
              >
                <img
                  src="arrow_forward.svg"
                  alt="Back"
                  className="w-5 h-5 transition-transform duration-200 transform hover:scale-110"
                />

              </button>
            )}
        </div>
    
        {/* Buttons below image on mobile */}
        {isMobile && (
          <div className="flex gap-4 mt-4 w-full justify-center">
            <button
              onClick={handlePrevPhoto}
              className="px-4 py-2 text-base rounded-lg bg-blue-600 text-white hover:bg-blue-800 transition"
            >
              <img
                  src="arrow_back.svg"
                  alt="Back"
                  className="w-5 h-5 transition-transform duration-200 transform hover:scale-110"
                />
            </button>
            <button
              onClick={handleNextPhoto}
              className="px-4 py-2 text-base rounded-lg bg-blue-600 text-white hover:bg-blue-800 transition"
            >
              <img
                  src="arrow_forward.svg"
                  alt="Back"
                  className="w-5 h-5 transition-transform duration-200 transform hover:scale-110"
                />
            </button>
          </div>
        )}
      </div>
    );
    
};

export default PhotosComponent;
