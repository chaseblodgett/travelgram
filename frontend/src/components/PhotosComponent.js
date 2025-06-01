import React, { useState, useEffect, useRef } from "react";

const PhotosComponent = ({ photos }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [maxDimensions, setMaxDimensions] = useState({height : 0, width: 0});
  const imageRefs = useRef([]);

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
  }, [photos]);
  

  if (!photos || photos.length === 0) return <p>No photos available</p>;

  const handleNextPhoto = () => {
    setPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "100%",
        textAlign: "center",
        margin: "0 auto",
      }}
    >
      {/* Fixed-Size Image Container */}
      <div
        className = "bg-white"
        style={{
          width: "350px",
          height: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "0px",
          overflow: "hidden",
        }}
      >
        <img
          src={photos[photoIndex]}
          alt={`photo-${photoIndex}`}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: "8px",
          }}
        />
      </div>

      {/* Navigation Buttons Below */}
      <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
        <button
          onClick={handlePrevPhoto}
          style={{
            padding: "8px 16px",
            fontSize: "16px",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          ‹ 
        </button>
        <button
          onClick={handleNextPhoto}
          style={{
            padding: "8px 16px",
            fontSize: "16px",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        > ›
        </button>
      </div>
    </div>
  );
};

export default PhotosComponent;
