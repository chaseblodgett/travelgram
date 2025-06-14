import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, InfoWindowF } from "@react-google-maps/api"; // Use InfoWindowF
import PhotosComponent from "./PhotosComponent";
import JournalComponent from "./JournalComponent";
import ItineraryComponent from "./ItineraryComponent";

const MapComponent = ({ markers, selectedMarkerZoomState, onCloseInfoWindow, onMarkerSelect, isFriendMarker, profilePicture, username, isBucketListMarker }) => {
  const mapRef = useRef(null);
  const [containerStyle, setContainerStyle] = useState({
    width: "100%",
    height: "100%",
  });


  const [initialBounds, setInitialBounds] = useState(null);
  const [photosLoaded, setPhotosLoaded] = useState(false);

  const onLoad = (map) => {

    mapRef.current = map;

    map.setOptions({
      scrollwheel: selectedMarkerZoomState[1],
      gestureHandling: selectedMarkerZoomState[1] ? "auto" : "none",
    });

  };

  useEffect(() => {
    const updateContainerStyle = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 640) {
        setContainerStyle({
          width: "100%",
          height: "60vh",
        });
      } else if (screenWidth < 1024) {
        setContainerStyle({
          width: "100%",
          height: "70vh",
        });
      } else {
        setContainerStyle({
          width: "100%",
          height: "100%",
        });
      }
    };

    window.addEventListener("resize", updateContainerStyle);
    updateContainerStyle();

    return () => {
      window.removeEventListener("resize", updateContainerStyle);
    };
  }, []);

  useEffect(() => {
    if (markers.length > 0 && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();

      markers.forEach((marker) => {
        bounds.extend({ lat: marker.lat, lng: marker.lng });
      });

      const map = mapRef.current;
      const center = bounds.getCenter();
      map.panTo({ lat: center.lat(), lng: center.lng() });
      map.fitBounds(bounds);

      setInitialBounds({
        center: center,
        zoom: map.getZoom(),
      });

      const listener = map.addListener("bounds_changed", () => {
        let zoom = map.getZoom();
        if (zoom > 6.5) {
          map.setZoom(6.5);
        }
        if (zoom < 2) {
          map.setZoom(2);
        }
        setInitialBounds({
          center: center,
          zoom: map.getZoom(),
        });
        window.google.maps.event.removeListener(listener);
      });
    } else {
      if (mapRef.current) {
        const map = mapRef.current;
        map.setZoom(2);
        map.panTo({ lat: 0, lng: 0 });
      }
    }
  }, [markers]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setOptions({
        scrollwheel: selectedMarkerZoomState[1],
        gestureHandling: selectedMarkerZoomState[1] ? "auto" : "none",
      });
      const marker = selectedMarkerZoomState[0];
      if(marker != null){
        mapRef.current.panTo({ lat: marker.lat, lng: marker.lng });
        mapRef.current.setZoom(6);
      }
    }
  }, [selectedMarkerZoomState]);

  const handleMarkerClick = (marker) => {
    if (!selectedMarkerZoomState[0]) {
      onMarkerSelect(marker);
      
      
      if (mapRef.current) {
        const map = mapRef.current;
        map.panTo({ lat: marker.lat, lng: marker.lng });
        map.setZoom(6);
      }
    }
  };

  const handleInfoWindowClose = () => {
    onCloseInfoWindow();
    if (mapRef.current && initialBounds) {
      const map = mapRef.current;

      map.setZoom(initialBounds.zoom);
      map.panTo(initialBounds.center);
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      defaultCenter={{ lat: 0, lng: 0 }}
      defaultZoom={2.5}
      mapTypeId="roadmap"
      onLoad={onLoad}
      options={{
        mapId: "b86306ec0d0b517bdb2b3415", 
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {markers.length > 0 &&
        markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.name}
            icon={{
              url: "pin.svg",
              scaledSize: new window.google.maps.Size(30, 30)
            }}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}

      {!isBucketListMarker && !isFriendMarker && selectedMarkerZoomState[0] && (
        <InfoWindowF
          position={{
            lat: selectedMarkerZoomState[0].lat,
            lng: selectedMarkerZoomState[0].lng,
          }}
          onCloseClick={handleInfoWindowClose}
          className="bg-gray-900 border border-purple-500 pt-0 mt-0"
        >
          
          <div className="w-[95vw] sm:w-[450px] max-w-[500px] overflow-hidden">
              <div className="p-4 flex flex-col gap-4 text-center rounded-lg shadow-lg bg-gray-900 border border-purple-500">
                
              <div className="flex items-start w-full relative">
              <div className="flex-1 text-center">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-200">
                  {selectedMarkerZoomState[0].name}
                </h3>
              </div>
              <button
                onClick={handleInfoWindowClose}
                className="absolute right-0 p-2 bg-gray-800 cursor-pointer opacity-80 hover:opacity-100 hover:animate-bounce-once-grow hover:scale-115 rounded-lg transition px-2"
                aria-label="Close"
              >
                 <img src="/close_purple.svg" alt="Add" className="w-4 h-4" />
              </button>
            </div>
              <PhotosComponent photos={selectedMarkerZoomState[0].photos} />

              <JournalComponent 
                destination={selectedMarkerZoomState[0].id} 
                isFriendJournal={false} 
                profilePicture={profilePicture}
                profileName={username}
              />
            </div>
          </div>

        </InfoWindowF>
      )}
      {!isBucketListMarker && isFriendMarker && selectedMarkerZoomState[0] && (
        <InfoWindowF
          position={{
            lat: selectedMarkerZoomState[0].lat,
            lng: selectedMarkerZoomState[0].lng,
          }}
          onCloseClick={handleInfoWindowClose}
        >
          {/* Outer Container to constrain width and prevent overflow */}
          <div className="w-[95vw] sm:w-[450px] max-w-[500px] overflow-hidden">
            <div className="p-4 flex flex-col gap-4 text-center rounded-lg shadow-lg bg-gray-900 border border-purple-700">
              
            <div className="flex items-start w-full relative">
              <div className="flex-1 text-center">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-200">
                  {selectedMarkerZoomState[0].name}
                </h3>
              </div>
              <button
                onClick={handleInfoWindowClose}
                className="absolute right-0 text-purple-400 hover:text-purple-300 text-xl font-bold px-2"
                aria-label="Close"
              >
                ×
              </button>
            </div>

              {/* Photos */}
              <PhotosComponent photos={selectedMarkerZoomState[0].photos} />
              <JournalComponent 
                destination={selectedMarkerZoomState[0].id} 
                isFriendJournal={isFriendMarker} 
                profilePicture={selectedMarkerZoomState[0].friendPicture}
                profileName={selectedMarkerZoomState[0].friendName}/>
            </div>
          </div>
        </InfoWindowF>
      )}
      {isBucketListMarker && selectedMarkerZoomState[0] && (
        <InfoWindowF
          position={{
            lat: selectedMarkerZoomState[0].lat,
            lng: selectedMarkerZoomState[0].lng,
          }}
          onCloseClick={handleInfoWindowClose}
        >
          {/* Outer Container to constrain width and prevent overflow */}
          <div className="w-[95vw] sm:w-[450px] max-w-[500px] overflow-hidden">
            <div className="p-4 flex flex-col gap-4 text-center rounded-lg shadow-lg bg-gray-900 border border-purple-700">
              
            <div className="flex items-start w-full relative">
              <div className="flex-1 text-center">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-200">
                  {selectedMarkerZoomState[0].place}
                </h3>
              </div>
              <button
                onClick={handleInfoWindowClose}
                className="absolute right-0 text-purple-400 hover:text-purple-300 text-xl font-bold px-2"
                aria-label="Close"
              >
                ×
              </button>
            </div>
              <ItineraryComponent bucketListId={selectedMarkerZoomState[0].id}/>
            </div>
          </div>
        </InfoWindowF>
      )}

    </GoogleMap>
  );
};

export default MapComponent;
