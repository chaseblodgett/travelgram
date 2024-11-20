import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Track My Travel</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/map" className="text-blue-600 hover:underline">Map</Link>
        </li>
        <li>
          <Link to="/journal" className="text-blue-600 hover:underline">Journals</Link>
        </li>
        <li>
          <Link to="/bucket-list" className="text-blue-600 hover:underline">Bucket List</Link>
        </li>
        <li>
          <Link to="/trips" className="text-blue-600 hover:underline">Trips</Link>
        </li>
        <li>
          <Link to="/forum" className="text-blue-600 hover:underline">Forum</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
