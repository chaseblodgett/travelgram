import { Link } from "react-router-dom";

const Sidebar = ({ onCloseInfoWindow }) => {

  const handleNavigation = () => {
    if (onCloseInfoWindow) {
      onCloseInfoWindow();
    }
  };

  return (
    <div className="bg-white text-gray-800 w-full lg:w-auto p-6 shadow-md">
      <div className="flex space-x-8">
        <Link
          to="/trips"
          onClick={handleNavigation} 
          className="text-lg text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition duration-300"
        >
          Trips
        </Link>
        <Link
          to="/bucketlist"
          onClick={handleNavigation} 
          className="text-lg text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition duration-300"
        >
          Bucket List
        </Link>
        <Link
          to="/friends"
          onClick={handleNavigation} 
          className="text-lg text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition duration-300"
        >
          Friends
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
