// components/PlaceMarkerPopup.js
import React, { useEffect, useRef, useState } from "react";

const PlaceMarkerPopup = ({ place }) => {
  const containerRef = useRef(null);
  const imageRefs = useRef([]);
  const [maxDimensions, setMaxDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateMaxDimensions = () => {
      let maxWidth = 0;
      let maxHeight = 0;

      imageRefs.current.forEach((img) => {
        if (img) {
          if (img.naturalWidth > maxWidth) maxWidth = img.naturalWidth;
          if (img.naturalHeight > maxHeight) maxHeight = img.naturalHeight;
        }
      });

      setMaxDimensions({ width: maxWidth, height: maxHeight });
    };
    console.log("place marker pop up");
    // Wait for all images to load
    const allLoaded = imageRefs.current.map((img) =>
      new Promise((resolve) => {
        if (img && img.complete) {
          resolve();
        } else if (img) {
          img.onload = resolve;
          img.onerror = resolve;
        }
      })
    );

    Promise.all(allLoaded).then(updateMaxDimensions);
  }, [place.photos]);

  return (
    <div>
      <h3>{place.name}</h3>
      <p>{place.journal}</p>
      {/* <div
        ref={containerRef}
        style={{
          width: `${maxDimensions.width}px`,
          height: `${maxDimensions.height}px`,
          border: "1px solid #ccc",
          position: "relative",
        }}
      >
        {place.photos.map((photo, index) => (
          <img
            key={index}
            src={photo.url}
            alt="Travel"
            ref={(el) => (imageRefs.current[index] = el)}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        ))}
      </div> */}
    </div>
  );
};

export default PlaceMarkerPopup;

// import React from "react";

// const PlaceMarkerPopup = ({ place }) => {
//   return (
//     <div>
//       <h3>{place.name}</h3>
//       <p>{place.journal}</p>
//       <div>
//         {place.photos.map((photo, index) => (
//           <img key={index} src={photo.url} alt="Travel" width="100" />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PlaceMarkerPopup;
