import React, { useState } from "react";

const PhotosComponent = ({ photos }) => {
  const [photoIndex, setPhotoIndex] = useState(0);

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
        width: "100%",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Current Photo */}
      <img
        src={photos[photoIndex]}
        alt={`photo-${photoIndex}`}
        style={{
          width: "85%",
          maxWidth: "400px",
          maxHeight: "600px",
          height: "75%",
          objectFit: "cover",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevPhoto}
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          cursor: "pointer",
        }}
      >
        ‹
      </button>
      <button
        onClick={handleNextPhoto}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          cursor: "pointer",
        }}
      >
        ›
      </button>
    </div>
  );
};

export default PhotosComponent;
