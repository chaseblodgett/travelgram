import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import TopNavigation from "./components/TopNavigation";
import MapComponent from "./components/MapComponent";
import JournalComponent from "./components/JournalComponent";
import BucketListComponent from "./components/BucketListComponent";
import TripListComponent from "./components/TripListComponent";
import TripDetailsComponent from "./components/TripDetailsComponent";
import LoginPage from "./components/LoginPage";
import SideBar from "./components/SideBar";
import RegisterPage from "./components/RegisterPage";
import { useNavigate } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import { useLocation } from "react-router-dom";
import Friends from "./components/Friends";
import Messages from "./components/Messages"
import AddFriends from "./components/AddFriends";
import AddTrip from "./components/AddTrip";
import AddDestinationStory from "./components/AddDestinationStory";
import { isFriday } from "date-fns";

const libraries = ["places"];

const App = () => {
  const [userId, setUserId] = useState(null);
  const [trips, setTrips] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [bucketListItems, setBucketListItems] = useState([]);
  const [selectedMarkerZoomState, setSelectedMarkerZoomState] = useState([null, true]); 
  const [isFriendMarker, setIsFriendMarker] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      setUserId(savedUserId);
    }
    
    const fetchTrips = async () => {
      try {
        const response = await fetch("/api/mytrips");
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const data = await response.json();
        setTrips(data);
       
        const allDestinations = data.flatMap((trip) =>
          trip.destinations.map((destination) => ({
            id : destination._id,
            name: destination.name,
            lat: parseFloat(destination.latitude),
            lng: parseFloat(destination.longitude),
            startDate: destination.startDate,
            endDate: destination.endDate,
            photos: destination.photos
          }))
        );

        if (location.pathname.startsWith("/trips")) {
          setMarkers(allDestinations);
          setIsFriendMarker(false);
        }
        
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    const fetchBucketList = async () => {
      try {
        const response = await fetch("/api/bucketlist");
        if (!response.ok) {
          throw new Error("Failed to fetch bucket list");
        }
        const data = await response.json();
        setBucketListItems(data);

        const updatedMarkers = data.map(item => ({
          id: item._id,
          lat: item.latitude,
          lng: item.longitude,
          place: item.place,
        }));
        
        if (location.pathname.startsWith("/bucketlist")) {
          setMarkers(updatedMarkers);
          setIsFriendMarker(false);
        }

      } catch (error) {
        console.error("Error fetching bucket list items:", error);
      }
    }

    const fetchFriends = async () => {
      try {
        const response = await fetch("/api/friends");
        if (!response.ok) {
          throw new Error("Failed to fetch friends");
        }
        const data = await response.json();
    
        setFriends(data.friends);
    
        const friendsDestinations = data.friends.flatMap(friend =>
          friend.trips.flatMap(trip =>
            trip.destinations.map(destination => ({
              id: destination.id, 
              name: destination.name,
              lat: parseFloat(destination.latitude),
              lng: parseFloat(destination.longitude),
              startDate: destination.startDate,
              endDate: destination.endDate,
              photos: destination.photos,
              friendName: friend.name,
              friendPicture: friend.picture
            }))
          )
        );
        if(location.pathname.startsWith("/friends")){
          setMarkers(friendsDestinations);
          setIsFriendMarker(true);
        }
        
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }

    const fetchFriendRequests = async () => {
      try {
        const response = await fetch("/api/friendRequests");
        if(!response.ok){
          throw new Error("Failed to fetch friend requests");
        }

        const data = await response.json();
        setFriendRequests(data);
      }
      catch (error){
        console.error("Error fetch friend requests: ", error);
      }
    }

    if (savedUserId) {
      fetchTrips();
      fetchBucketList();
      fetchFriends();
      fetchFriendRequests();
    }
  }, [location.pathname]);

  const handleLogin = async (userId) => {
    setUserId(userId);
    localStorage.setItem("userId", userId);
    handleAllTrips();
    navigate('/trips');
    window.location.reload();
    window.location.reload();
    handleAllTrips();
  };

  const handleRegister = (userId) => {
    setUserId(userId);
    localStorage.setItem("userId", userId);
    navigate("/trips");
  };

  const handleMarkerSelect = (marker) => {
    setSelectedMarkerZoomState([marker, false]);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarkerZoomState([null, true]);
  };

  const onClickDestination = (destination) =>{
    const newMarker = {
      lat : parseFloat(destination.latitude),
      lng : parseFloat(destination.longitude),
      id : destination._id,
      name: destination.name,
      photos: destination.photos,
      startDate : destination.startDate,
      endDate : destination.endDate,
    }
    setSelectedMarkerZoomState([newMarker, false]);
    setIsFriendMarker(false);
  };

  const acceptFriendRequest = async (userId) => {
    try {
      
      const response = await fetch(`/api/acceptFriend/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const result = await response.json();

      setFriendRequests((prevRequests) => prevRequests.filter(request => request._id !== userId));
      setFriends((prevFriends) => [...prevFriends, result.newFriend]);

      console.log("Friend request accepted!");
      
      
    } catch (error) {
      setError(error.message || "Something went wrong");
      console.error("Error accepting friend request:", error);
    }
  };

  const declineFriendRequest = async (userId) => {
    try {
      
      const response = await fetch(`/api/declineFriend/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const result = await response.json();
      setFriendRequests((prevRequests) => prevRequests.filter(request => request._id !== userId));
      console.log("Friend request accepted!");
  
    
    } catch (error) {
      setError(error.message || "Something went wrong");
      console.error("Error declining friend request:", error);
    }
  }
  

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
  
      setUserId(null);
      localStorage.removeItem("userId");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };
  

  const handleNewTrip = (trip) => {
   
    const allDestinations = trip.destinations.map((destination) => ({
      id : trip._id,
      name: destination.name,
      lat: parseFloat(destination.latitude),
      lng: parseFloat(destination.longitude),
      startDate: destination.startDate,
      endDate: destination.endDate,
      photos: destination.photos,
    }));
  
    navigate(`/trip/${trip._id}`);
    setMarkers(allDestinations);
    setIsFriendMarker(false);
  };

  const handleRemoveTrip = (trip) => {
    try {
      const isItemInList = trips.some((item) => item._id === trip._id);
  
      let updatedTrips;
      if (isItemInList) {
        updatedTrips = trips.filter((item) => item._id !== trip._id);
      } else {
        updatedTrips = [...trips, trip];
      }
  
      setTrips(updatedTrips);
      handleAllTrips(updatedTrips);
      navigate("/trips");
    } catch (error) {
      console.error("Error handling trip item:", error);
    }
  };
  
  const handleAllTrips = (tripsList = trips) => {
    const allDestinations = tripsList.flatMap((trip) =>
      trip.destinations.map((destination) => ({
        id : trip._id,
        name: destination.name,
        lat: parseFloat(destination.latitude),
        lng: parseFloat(destination.longitude),
        startDate: destination.startDate,
        endDate: destination.endDate,
        photos: destination.photos,
      }))
    );
    setMarkers(allDestinations);
    setIsFriendMarker(false);
    navigate("/trips");
  };
  

  const handleChangeMarkers = () => {
    const allDestinations = trips.flatMap((trip) =>
          trip.destinations.map((destination) => ({
            id : destination._id,
            name: destination.name,
            lat: parseFloat(destination.latitude),
            lng: parseFloat(destination.longitude),
            startDate: destination.startDate,
            endDate: destination.endDate,
            photos: destination.photos,
          }))
        );
    setMarkers(allDestinations);
    setIsFriendMarker(false);
  };

  const handleBucketListMarkers = () => {
    const markersData = bucketListItems.map(item => ({
      id: item._id, 
      lat: item.latitude,
      lng: item.longitude,
      place: item.place, 
    }));

    setMarkers(markersData);
    setIsFriendMarker(false);
  };

  const handleFriendRequestMarkers = () => {
    const friendsDestinations = friends.flatMap(friend =>
      friend.trips.flatMap(trip =>
        trip.destinations.map(destination => ({
          id: destination.id, 
          name: destination.name,
          lat: parseFloat(destination.latitude),
          lng: parseFloat(destination.longitude),
          startDate: destination.startDate,
          endDate: destination.endDate,
          photos: destination.photos,
          friendName: friend.name,
          friendPicture: friend.picture
        }))
      )
    );
    handleCloseInfoWindow();
    setMarkers(friendsDestinations);
    setIsFriendMarker(true);
  }

  const handleAddRemoveBucketList = async (bucketListItem) => {
    try {
      
      const isItemInList = bucketListItems.some(item => item._id === bucketListItem._id);
      let updatedBucketListItems;

      if (isItemInList) {
        updatedBucketListItems = bucketListItems.filter(item => item._id !== bucketListItem._id);
      } else {
        updatedBucketListItems = [...bucketListItems, bucketListItem];
      }
  
      setBucketListItems(updatedBucketListItems);
      const updatedMarkers = updatedBucketListItems.map(item => ({
        id: item._id,
        lat: item.latitude,
        lng: item.longitude,
        place: item.place,
      }));
  
      setMarkers(updatedMarkers);
  
    } catch (error) {
      console.error("Error handling bucket list item:", error);
    }
  };

  const clearMarkers = () => {
    setMarkers([]);
  }

  const addMarker = (destination) =>{
    const newMarker = {
      lat : parseFloat(destination.latitude),
      lng : parseFloat(destination.longitude),
      id : destination._id,
      place: destination.name,
      photos: destination.photos,
      startDate : destination.startDate,
      endDate : destination.endDate,
    }
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    setIsFriendMarker(false);
  };

  const setFriendMarkers = (friend) => {
    const friendMarkers = friend.trips.flatMap(trip =>
      trip.destinations.map(destination => ({
        id: destination.id, 
        name: destination.name,
        lat: parseFloat(destination.latitude),
        lng: parseFloat(destination.longitude),
        startDate: destination.startDate,
        endDate: destination.endDate,
        photos: destination.photos,
        friendName: friend.name,
        picture: friend.picture 
      }))
    );
    setMarkers(friendMarkers);
    setIsFriendMarker(true);
  };


  const handleSubmitTrip = async (tripData) => {
    const { tripName, startDate, endDate, destinations } = tripData;
  
    const formData = new FormData();
  
    formData.append("name", tripName);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
  
    destinations.forEach((destination, index) => {
      formData.append(`destinations[${index}][name]`, destination.name);
      formData.append(`destinations[${index}][startDate]`, destination.startDate);
      formData.append(`destinations[${index}][endDate]`, destination.endDate);
      formData.append(`destinations[${index}][latitude]`, destination.latitude);
      formData.append(`destinations[${index}][longitude]`, destination.longitude);
  
      if (destination.photos) {
        destination.photos.forEach((photo) => {
          formData.append(`photos[${index}]`, photo); 
        });
      }
    });
  
    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to save trip");
      }
  
      const savedTrip = await response.json();
      console.log(savedTrip.trip);
      handleNewTrip(savedTrip.trip);
    } catch (err) {
      console.error("Error saving trip:", err);
    }
  };
  
  return (
    <div className="h-screen">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY} libraries={libraries}>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
 
          <Route element={<ProtectedRoute user={userId} />}>
            <Route path="/" element={<WithMapLayout
                    handleLogout={handleLogout}
                    trips={trips}
                    markers={markers.length > 0 ? markers : []}
                    handleChangeMarkers={handleChangeMarkers}
                    handleBucketListMarkers={handleBucketListMarkers} 
                    onCloseInfoWindow={handleCloseInfoWindow}
                    onMarkerSelect={handleMarkerSelect}
                    selectedMarkerZoomState={selectedMarkerZoomState}
                    clearMarkers={clearMarkers}
                    isFriendMarker={isFriendMarker}
                  />}>
              <Route path="/" 
                element={<TripListComponent 
                handleNewTrip = {handleNewTrip} 
                handleRemoveTrip = {handleRemoveTrip} 
                onCloseInfoWindow={handleCloseInfoWindow}
                clearMarkers={clearMarkers}
                addMarker={addMarker}
                showAllTrips={handleAllTrips}/>} />
              <Route path="/trips" 
                element={<TripListComponent 
                handleNewTrip = {handleNewTrip} 
                handleRemoveTrip = {handleRemoveTrip} 
                onCloseInfoWindow={handleCloseInfoWindow}
                clearMarkers={clearMarkers}
                addMarker={addMarker}
                showAllTrips={handleAllTrips}/>} />
              <Route path="/bucketlist" element={<BucketListComponent handleChange = {handleAddRemoveBucketList}/>} />
              <Route path="/trip/:id" 
                element={<TripDetailsComponent 
                handleAllTrips={ handleAllTrips } 
                onClickBack={handleCloseInfoWindow}
                onClickDestination={onClickDestination}
                />} />
              <Route path="/friends" element={<Friends 
                allFriends={friends} 
                friendRequests={friendRequests}
                onAcceptRequest={acceptFriendRequest}
                onDeclineRequest={declineFriendRequest}
                setFriendMarkers={setFriendMarkers}/>} />
              <Route path="/messages/:id" element={<Messages userId={ userId } setAllFriendMarkers={handleFriendRequestMarkers}/>} />
              <Route path="/addFriends" element={<AddFriends/>} />
              <Route path="/addTrip" element={<AddTrip 
                onSave={handleSubmitTrip} 
                addNewMarker={addMarker}
                clearMarkers={clearMarkers}/>} />
              
            </Route>
          </Route>
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </LoadScript>
    </div>
  );
};

const WithMapLayout = ({ handleLogout, markers, handleChangeMarkers, handleBucketListMarkers, onCloseInfoWindow, onMarkerSelect, selectedMarkerZoomState, clearMarkers, isFriendMarker }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/bucketlist")) {
      handleBucketListMarkers();
    } else if(location.pathname.startsWith("/messages/")){

    }
    else if(location.pathname.startsWith("/addTrip/")){
      clearMarkers();
    }
    //  else if (!location.pathname.startsWith("/trip/")) {
    //   handleChangeMarkers();
    // } 
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation */}
      <TopNavigation handleLogout={handleLogout} />

      <div className="flex flex-grow flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-2/5 w-full bg-gray-100 p-4">
          <SideBar onCloseInfoWindow={onCloseInfoWindow}/>
          <div className="mt-4">
            <Outlet />
          </div>
        </div>

        <div className="lg:w-3/5 w-full h-full lg:h-auto flex-grow">
          <div className="h-[300px] lg:h-full"> 
            <MapComponent 
            markers={markers.length > 0 ? markers : []} 
            selectedMarkerZoomState={selectedMarkerZoomState} 
            onCloseInfoWindow={onCloseInfoWindow}
            onMarkerSelect={onMarkerSelect}
            isFriendMarker={isFriendMarker}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


const ProtectedRoute = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/protected", {
          method: "GET",
          credentials: "same-origin",
        });

        if (response.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        setAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default App;
