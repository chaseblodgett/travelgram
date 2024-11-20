// src/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import your components
import MapComponent from "./components/MapComponent";
import JournalComponent from "./components/JournalComponent";
import BucketListComponent from "./components/BucketListComponent";
import TripListComponent from "./components/TripListComponent";
import ForumComponent from "./components/ForumComponent";
import TripDetailsComponent from "./components/TripDetailsComponent";
import Main from "./components/Main";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<Main />} />
        <Route path="/map" element={<MapComponent places={[]} />} />
        <Route path="/journal" element={<JournalComponent place={{ name: "Sample Place" }} />} />
        <Route path="/bucket-list" element={<BucketListComponent />} />
        <Route path="/trips" element={<TripListComponent />} />
        <Route path="/trip/:id" element={<TripDetailsComponent trip={{ name: "Sample Trip", places: [] }} />} />
        <Route path="/forum" element={<ForumComponent />} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

