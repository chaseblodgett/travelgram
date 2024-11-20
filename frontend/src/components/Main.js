import React from "react";
import MapComponent from "./MapComponent";
import Navigation from "./Navigation";

const Main = () => {
  return (
    <div className="flex h-screen">
      {/* Left Pane: Navigation/Menu */}
      <div className="w-1/3 bg-gray-100 border-r border-gray-300 overflow-y-auto p-4">
        <Navigation />
      </div>

      {/* Right Pane: Map */}
      <div className="w-2/3 h-full">
        <MapComponent places={[]} />
      </div>
    </div>
  );
};

export default Main;
