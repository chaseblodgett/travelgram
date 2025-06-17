const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require("path")
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcrypt');
const multer = require('multer'); 
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { restart } = require('nodemon');


require('dotenv').config();


const app = express();
const server = http.createServer(app); 
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), 
    cookie: { maxAge: 10000 * 60 * 60 },
  })
);

app.use(express.static(path.join(__dirname, "../frontend/build")));

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'travel_photos',
      format: async (req, file) => 'jpg', 
    },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  },
});

const defaultProfilePicture = cloudinary.url('profile_pictures/qfw7pzi7ub7h3uhy2ez9', {
  secure: true,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  picture: { type: String, default: defaultProfilePicture},
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
  bucketList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BucketList' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  friends: [{ type : mongoose.Schema.Types.ObjectId, ref: "User"}],
  friendRequests: [{ type : mongoose.Schema.Types.ObjectId, ref: "User"}]
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


const tripSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    name: { type: String, required: true }, 
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }], 
    });

const destinationSchema = new mongoose.Schema({
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true }, 
    name: { type: String, required: true }, 
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    photos: [{ type: String }],
    latitude : {type : Number},
    longitude: {type : Number},
    journalEntry: {
      content: { type: String },
      timestamp: { type: Date, default: Date.now },
    }
  });

const bucketListSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    place: { type: String, required: true }, 
    latitude : {type: Number},
    longitude : {type: Number},
    isVisited: { type: Boolean, default: false }, 
    itinerary: [{type : String}]
  });

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }, 
});

const conversationSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  lastMessage: { type: String }, 
  updatedAt: { type: Date, default: Date.now },
});

conversationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);
const Trip = mongoose.model('Trip', tripSchema);
const Destination = mongoose.model('Destination', destinationSchema);
const Message = mongoose.model('Message', messageSchema);
const BucketList = mongoose.model('BucketList', bucketListSchema);
const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = { User, Trip, Destination, Message, BucketList, Conversation };

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};


app.get("/api/trips/:id", async (req, res) => {
  const { id } = req.params;
  const user = req.session.id; 

  if (user) {
    try {

      const trip = await Trip.findById(id).populate("destinations");

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // if (String(user) !== String(trip.user)) {
      //   return res.status(401).json({ message: "Unauthorized" });
      // }

    
      res.status(200).json(trip);
    } catch (error) {
      console.error("Error fetching trip:", error);
      res.status(500).json({ message: "Error fetching trip details", error: error.message });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/api/bucketlist", async (req, res) => {
  const user = req.session.userId;
  if(user){
    try{

      const bucketList = await BucketList.find({ user: user });
      if(!bucketList){
        return res.status(404).json({ message: "No bucket list found for this user" });
      }
      res.status(200).json(bucketList);
    }
    catch{
      console.error("Error fetching bucket list:", error);
      res.status(500).json({ message: "Error fetching bucket list", error: error.message });
    }
  }
  else{
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.post('/api/bucketlist/:id/markVisited', isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const updatedItem = await BucketList.findByIdAndUpdate(
      id,
      { isVisited: true },
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Bucket list item not found' });
    }

    res.status(200).json({ message: 'Bucket list item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Error updating bucket list item:', error);
    res.status(500).json({ error: 'An error occurred while updating the item' });
  }
});

app.delete('/api/bucketlist/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  try {
    const deletedItem = await BucketList.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Bucket list item not found' });
    }

    console.log(userId);
    const user = await User.findById(userId);
    user.bucketList = user.bucketList.filter((bucketListId) => !bucketListId.equals(id));
    await user.save();

    res.status(200).json({ message: 'Bucket list item deleted successfully', item: deletedItem });
  } catch (error) {
    console.error('Error deleting bucket list item:', error);
    res.status(500).json({ error: 'An error occurred while deleting the item' });
  }
});

app.post("/api/bucketlist", async (req, res) => {
  const { place, latitude, longitude } = req.body;
  const userId = req.session.userId;
  console.log(req.body);

  if (!place || !latitude || !longitude) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (userId) {
    try {
  
      const bucketList = new BucketList({ user: userId, place, latitude, longitude });
      const savedItem = await bucketList.save();

      const user = await User.findById(userId);
      user.bucketList.push(bucketList._id);
      await user.save();

      res.status(201).json({ data: savedItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update bucket list", error: error.message });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/api/mytrips", async (req, res) => {
  const userId = req.session.userId;

  if (userId) {
    try {
      
      const trips = await Trip.find({ user: userId })
        .populate({
          path: 'destinations', 
          populate: {
            path: 'trip', 
            model: 'Trip' 
          }
        })
        .exec();

      if (!trips) {
        return res.status(404).json({ message: "No trips found for this user" });
      }

      res.status(200).json(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ message: "Error fetching trips", error: error.message });
    }
  } else {

    res.status(401).json({ message: "Unauthorized" });
  }
});

app.post("/api/journal", isAuthenticated, async (req, res) =>{
  const { destinationId, content, date} = req.body;
  const userId = req.session.userId;

  if (!destinationId || !content || !date){
    return res.status(400).json({error : "All fields are required."} );
  }

  if(!userId){
    return res.status(400).json({error : "Unauthorized action."});
  }

  try {

    const destination = await Destination.findById(destinationId);
    destination.journalEntry.content = content;
    destination.journalEntry.timestamp = date;

    await destination.save();
    return res.status(201).json({savedItem : destination});
  }
  catch (err){
    console.log(err);
    return res.status(500).json({error : "Internal service error."})
  }
});

app.get("/api/journal/:destinationId", isAuthenticated, async (req, res) =>{
  const { destinationId } = req.params;
  const userId = req.session.userId;

  if (!userId){
    return res.status(400).json({ error : "Unauthorized access. "});
  }

  if (!destinationId){
    return res.status(400).json({ error : "Must provide destination ID"});
  }

  try {
    const destination = await Destination.findById(destinationId);

    if (!destination) {
      return res.status(404).json({ error: "Destination not found." });
    }

    const journalEntry = destination.journalEntry || {};
    const journalContent = journalEntry.content || "";
    const date = journalEntry.timestamp || null;

    return res.status(200).json({ content : journalContent, timestamp: date});
  }

  catch (err) {
    console.error("Error fetching journal entry:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/userDetails", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  if (!userId){
    return res.status(400).json({error : "Unauthorized access"});
  }

  try {
    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({error : "User not found"});
    }
    const username = user.name;
    const picture = user.picture;

    return res.status(200).json({ username: username, profilePicture: picture});

  }
  catch{
    return res.status(500).json({error : "Internal service error"});
  }
});

app.get("/api/itinerary/:id", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const bucketListId = req.params.id;

  if(!userId) {
    return res.status(400).json({error : "Unauthorized Access"});
  }

  if(!bucketListId){
    return res.status(400).json({error : "Must provide bucket list ID"});
  }

  try {
    const bucketList = await BucketList.findById(bucketListId);

    if(!bucketList){
      return res.status(400).json({error : "Could not find bucket list"});
    }

    const itinerary = bucketList.itinerary;

    return res.status(200).json({itinerary : itinerary});
  }
  catch{
    return res.status(500).json({error : "Internal service error."})
  }
});

app.post("/api/itinerary", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const { bucketListId, itinerary } = req.body;

  if (!bucketListId || !Array.isArray(itinerary)) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  try {
    
    const bucketList = await BucketList.findById(bucketListId);

    if (!bucketList) {
      return res.status(404).json({ error: "Bucket list not found" });
    }

    bucketList.itinerary = itinerary;
    await bucketList.save();

    res.status(200).json({ message: "Itinerary saved successfully" });
  } catch (error) {
    console.error("Error saving itinerary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/api/trips", isAuthenticated, upload.any(), async (req, res) => {
  const { name, startDate, endDate, destinations } = req.body;
  const userId = req.session.userId;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
  
    const trip = new Trip({ user: userId, name, startDate, endDate });

    const groupedPhotos = (req.files || []).reduce((acc, file) => {
      const match = file.fieldname.match(/photos\[(\d+)]/); 
      if (match) {
        const index = parseInt(match[1], 10); 
        acc[index] = acc[index] || [];
        acc[index].push(file);
      }
      return acc;
    }, {});


    const destinationDocs = await Promise.all(
      destinations.map(async (destination, index) => {
        const lat = parseFloat(destination.latitude);
        const lng = parseFloat(destination.longitude);

        if (isNaN(lat) || isNaN(lng)) {
          throw new Error(`Invalid latitude or longitude for destination: ${destination.name}`);
        }

        const photos = groupedPhotos[index]
          ? await Promise.all(
              groupedPhotos[index].map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                  folder: "/travel_photos",
                  use_filename: true,
                  unique_filename: false,
                });
                return result.secure_url;
              })
            )
          : [];
        
        const newJournal = {content : destination.story, timestamp: new Date()};
        console.log(newJournal);
    
        const destinationDoc = new Destination({
          trip: trip._id,
          name: destination.name,
          startDate: destination.startDate,
          endDate: destination.endDate,
          latitude: lat,
          longitude: lng,
          journalEntry: newJournal,
          photos,
        });
        return destinationDoc.save();
      })
    );

    trip.destinations = destinationDocs.map((doc) => doc._id);
    await trip.save();
    const populatedTrip = await Trip.findById(trip._id).populate('destinations');

    const user = await User.findById(userId);
    user.trips.push(trip._id);
    await user.save();

    res.status(201).json({ message: "Trip and destinations saved successfully", trip: populatedTrip });
  } catch (error) {
    console.error("Error saving trip:", error);
    res.status(500).json({ error: error.message });
  }
});


app.delete("/api/trips/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  try {
   
    const trip = await Trip.findById(id).populate({
      path: "destinations",
      model: "Destination",
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const tripData = {
      ...trip.toObject(),
      destinations: trip.destinations,
    };
    await Destination.deleteMany({ trip: id });
    await Trip.findByIdAndDelete(id);

    const user = await User.findById(userId);
    user.trips = user.trips.filter((tripId) => !tripId.equals(id));
    await user.save();

    res.status(200).json({
      message: "Trip and its associated destinations deleted successfully",
      deletedTrip: tripData,
    });
  } catch (error) {
    console.error("Error deleting trip and destinations:", error);
    res.status(500).json({ error: "An error occurred while deleting the trip and its destinations" });
  }
});


app.post('/api/register', upload.single('profilePicture'), async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    let profilePictureUrl = defaultProfilePicture; 
    if (req.file) {
      profilePictureUrl = req.file.path; 
    }

    const user = new User({
      name,
      email,
      password, 
      picture: profilePictureUrl,
    });

    req.session.id = user._id;
    req.session.userId = user._id;
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user._id;
    res.status(200).json({ message: "Login successful", user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/getUserFriends", isAuthenticated, async(req, res) => {
  const userId = req.session.userId;
  if (!userId){
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(userId).populate({
      path: "friends"
    });

    if(!user){
      return res.status(404).json({ error: "User not found"})
    }

    const friends = user.friends.map((friend) => ({
      id: friend._id
    }));

    return res.status(200).json({ userId, friends });

  }
  catch{
    console.error("Error fetching friends and user Id:", error);
    res.status(500).json({ error: "Internal server error" });
  }


});

app.get("/api/friends", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(userId).populate({
      path: "friends",
      populate: {
        path: "trips",
        populate: {
          path: "destinations",
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const mutualFriends = user.friends.filter((friend) => {
      return friend.friends.includes(userId); 
    });

    const friends = mutualFriends.map((friend) => ({
      id: friend._id,
      name: friend.name,
      email: friend.email,
      picture: friend.picture,
      trips: friend.trips.map((trip) => ({
        id: trip._id,
        name: trip.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        destinations: trip.destinations.map((destination) => ({
          id: destination._id,
          name: destination.name,
          startDate: destination.startDate,
          endDate: destination.endDate,
          photos: destination.photos,
          latitude: destination.latitude,
          longitude: destination.longitude,
        })),
      })),
    }));


    res.status(200).json({ friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/api/search-users", isAuthenticated, async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Search query is required" });

  try {
    const users = await User.find({ name: { $regex: query, $options: "i" } }).select("id name picture");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to search users" });
  }
});

app.post("/api/add-friend/:userId", isAuthenticated, async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.session.userId;

  if (!currentUserId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ error: "Target user not found" });
    }

    if (!currentUser.friends.includes(userId)) {
      currentUser.friends.push(userId);
      await currentUser.save();
    }

    if (!targetUser.friendRequests.includes(currentUserId)) {
      targetUser.friendRequests.push(currentUserId);
      await targetUser.save();
    }

    res.status(200).json({ message: "Friend added and friend request sent" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add friend" });
  }
});

app.get("/api/friendRequests", isAuthenticated, async (req, res) => {
  const userId = req.session.userId; 

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friendRequests = await User.find({
      _id: { $in: user.friendRequests },
    }).select('name _id');  
    
    res.status(200).json(friendRequests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ error: "Failed to fetch friend requests" });
  }
});

app.post("/api/acceptFriend/:id", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const currentUser = await User.findById(userId);
    const requester = await User.findById(id).populate({
      path: "trips",
      populate: {
        path: "destinations",
      },
    });

    if (!currentUser || !requester) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!currentUser.friendRequests.includes(id)) {
      return res.status(400).json({ error: "No such friend request exists" });
    }

    currentUser.friends.push(id);
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (friendId) => friendId.toString() !== id
    );
    await currentUser.save();

    res.status(200).json({
      message: "Friend request accepted",
      newFriend: requester,
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: "Failed to accept friend request" });
  }
});


app.post("/api/declineFriend/:id", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
 
    const currentUser = await User.findById(userId);
    const requester = await User.findById(id);

    if (!currentUser || !requester) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!currentUser.friendRequests.includes(id)) {
      return res.status(400).json({ error: "No such friend request exists" });
    }

    currentUser.friendRequests = currentUser.friendRequests.filter(
      (friendId) => friendId.toString() === id
    );
    await currentUser.save();

    requester.friends = requester.friends.filter(
      (friendId) => friendId.toString() !== userId
    );
    await requester.save();

    res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    console.error("Error declining friend request:", error);
    res.status(500).json({ error: "Failed to decline friend request" });
  }
});

app.get("/api/conversation/:roomId", isAuthenticated, async (req, res) => {
  const { roomId } = req.params; 
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    
    let conversation = await Conversation.findOne({ roomId })
      .populate("participants", "name email") 
      .populate({
        path: "messages",
        populate: { path: "sender", select: "name email" }, 
      });

    if (!conversation) {
      
      const [user1Id, user2Id] = roomId.split("_"); 
      if (!user1Id || !user2Id || ![user1Id, user2Id].includes(userId)) {
        return res.status(400).json({ error: "Invalid roomId or unauthorized access" });
      }

      conversation = new Conversation({
        roomId,
        participants: [user1Id, user2Id],
        messages: [], 
      });

      await conversation.save();

      conversation = await conversation
        .populate("participants", "name email")
        .populate({
          path: "messages",
          populate: { path: "sender", select: "name email" },
        })
        .execPopulate();
    }

    if (!conversation.participants.some((p) => p._id.toString() === userId)) {
      return res.status(403).json({ error: "You are not part of this conversation" });
    }

    res.status(200).json({ conversation });
  } catch (error) {
    console.error("Error fetching or creating conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


io.on("connection", (socket) => {

  socket.on("join", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", async (message) => {
    const { to, text, from } = message;
    try {
     
      let conversation = await Conversation.findOne({
        participants: { $all: [from, to] },
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [from, to],
        });
        await conversation.save();
      }

      const newMessage = new Message({
        conversation: conversation._id,
        sender: from,
        content: text,
      });
      await newMessage.save();

      conversation.messages.push(newMessage._id);
      conversation.lastMessage = text;
      await conversation.save();

      io.to(to).emit("receive_message", {
        from,
        text,
        timestamp: new Date().toISOString(),
      });

      io.to(from).emit("message_sent", { success: true });
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("disconnect", () => {
    
  });
});




app.get('/api/protected', isAuthenticated, (req, res) => {
  res.status(200).json({ message: 'Protected content', userId: req.session.userId });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });