const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const AuthAdmin = require("firebase-admin");
const Feed=require('./models/FeedBack');


const Model = require("./models/Courses");
const Enrolled = require("./models/EnrolledCourse");
const Profile = require("./models/Profile");
const User = require("./models/user");



dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


AuthAdmin.initializeApp({
  credential: AuthAdmin.credential.applicationDefault(),
  projectId: "gainwithus-817a4"
});


const authenticate = (req, res, next) => {
  const token =
    req.headers.authorization &&
    req.headers.authorization.split(" ")[1];


  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }else{
  AuthAdmin.auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.user = decodedToken; 
      next();
    })
    .catch((error) => {
      console.error("Token verification failed:", error);
      return res.status(403).json({ error: "Invalid or expired token" });
    });
  }
};


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.get("/Feed",async(req,res)=>{
  try{
  const Feeds=await  Feed.find({});
  res.json(Feeds);
  }
  catch(err){
    res.status(500);
  }
})
app.post("/Feed",authenticate, async(req,res)=>{
try{
  await Feed.create(req.body);
  res.status(201);
}catch(err){
  res.status(500).json({
    error:"Server error"
  })
}
});


app.get("/MenCourse", authenticate, async (req, res) => {
  try {
    const { Username } = req.query; // Extract Username from query parameters
    console.log(Username);
    if (!Username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Fetch courses by mentor's username
    const courses = await Model.find({ Mentor: Username });

    if (!courses) {
      return res.status(404).json({ error: "Courses not found for the given username" });
    }

    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);

    // Optionally log more detailed errors in development
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/Course", async (req, res) => {
  try {
    const courses = await Model.find({});
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a profile's cart
app.put("/Profile/:id", authenticate, async (req, res) => {
  try {
    const user = await Profile.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.Cart.push(req.body.Cart);
    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get enrolled course by UserId
app.get("/Ecourse/:UserId", authenticate, async (req, res) => {
  try {
    const enrolledCourse = await Enrolled.find({ UserId: req.params.UserId });
    if (!enrolledCourse)
      return res.status(404).json({ error: "No enrolled course found" });
    res.json(enrolledCourse);
  } catch (err) {
    console.error("Error fetching enrolled course:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update enrolled course
app.put("/Ecourse/:UserId", authenticate, async (req, res) => {
  try {
    const enrolledCourse = await Enrolled.findOneAndUpdate(
      { UserId: req.params.UserId },
      req.body,
      { new: true }
    );
    if (!enrolledCourse)
      return res.status(404).json({ error: "No enrolled course found" });
    res.json(enrolledCourse);
  } catch (err) {
    console.error("Error updating enrolled course:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create enrolled course
app.post("/Ecourse", authenticate, async (req, res) => {
  try {
    await Enrolled.create(req.body);
    res.status(201).json({ message: "Enrolled course created successfully" });
  } catch (err) {
    console.error("Error creating enrolled course:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a course
app.put("/Course/:id", authenticate, async (req, res) => {
  try {
    const updatedCourse = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedCourse)
      return res.status(404).json({ error: "Course not found" });
    res.json(updatedCourse);
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a course
app.delete("/Course/:id", authenticate, async (req, res) => {
  try {
    const deletedCourse = await Model.findByIdAndDelete(req.params.id);
    if (!deletedCourse)
      return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new course
app.post("/Course", authenticate, async (req, res) => {
  try {
    const {
      Name,
      Image,
      Des,
      M1Name,
      M2Name,
      M3Name,
      M1Video,
      M2Video,
      M3Video,
      Level,
      Price,
      Mentor,
    } = req.body;

    const newCourse = await Model.create({
      Name,
      Image,
      Des,
      M1Name,
      M2Name,
      M3Name,
      M1Video,
      M2Video,
      M3Video,
      Level,
      Price,
      Mentor,
    });
    res.status(201).json(newCourse);
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all profiles
app.get("/Profile", authenticate, async (req, res) => {
  try {
    const { Username } = req.query; // Use query parameters for GET requests
    if (!Username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const profile = await Profile.findOne({ Username: Username });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// Create a profile
app.post("/Profile", async (req, res) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all registered users
app.get("/Register", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a registered user
app.post("/Register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a cart item

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
