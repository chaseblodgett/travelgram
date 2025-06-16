import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ onCloseInfoWindow }) => {
  const location = useLocation();
  const activePath = location.pathname;

  const handleNavigation = () => {
    if (onCloseInfoWindow) {
      onCloseInfoWindow();
    }
  };

  const linkClasses = (path) =>
    `relative text-lg text-gray-300 hover:text-purple-400 transition duration-300
    after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] 
    after:w-0 after:bg-purple-500 hover:after:w-full after:transition-all after:duration-300 ${
      activePath === path ? 'after:w-full text-purple-400' : ''
    }`;


    return (
      <div className="bg-gray-900 text-gray-500 w-full lg:w-auto p-6 font-sans">
        <div className="flex space-x-8 text-gray-500">
          <Link to="/trips" onClick={handleNavigation} className={linkClasses("/trips")}>
            Trips
          </Link>
          <Link to="/bucketlist" onClick={handleNavigation} className={linkClasses("/bucketlist")}>
            Bucket List
          </Link>
          <Link to="/friends" onClick={handleNavigation} className={linkClasses("/friends")}>
            Friends
          </Link>
        </div>
      </div>
    );
  };

export default Sidebar;
