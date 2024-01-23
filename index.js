const Model = require("./models/Courses");
const Profile=require('./models/Profile');
const User = require("./models/user");
const Cart = require("./models/Cart");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
const Private = "Kanish@KK";
app.use(express.json());
app.use(cors());
mongoose
  .connect(
    "mongodb+srv://Kanish:Kanish%400603@kanish0603.p7ibjps.mongodb.net/E-learning"
  )
  .then(console.log("connected db"));

app.get("/Course", (req, res) => {
  Model.find({})
    .then((x) => res.json(x))
    .catch((err) => res.json(err));
});
app.put('/Profile/:id',async(req,res)=>{
  console.log(req.body);
  const user=await Profile.findById(req.params.id);
  user.Cart.push(req.body.Cart);
  user.save();

})
app.put('/Course/:id',async(req,res)=>{
 
  await Model.findByIdAndUpdate(req.params.id,req.body,{new:false});
});
app.delete('/Course/:id',async(req,res)=>{
  //console.log(req.params);
  await Model.findByIdAndDelete(req.params.id);
})
app.post('/Course',async(req,res)=>{
  const{ Name, Image, Des, M1Name, M2Name, M3Name, M1Video, M2Video, M3Video, Level, Price,Mentor}=req.body;
  await Model.create({ Name, Image, Des, M1Name, M2Name, M3Name, M1Video, M2Video, M3Video, Level, Price,Mentor});
})
app.get('/Profile',(req,res)=>{
  Profile.find({}).then((x)=>res.json(x)).catch((err)=>res.json(err));
});

app.post('/Profile',async(req,res)=>{
  await Profile.create(req.body);
})
app.get('/Register',(req,res)=>{
  User.find({}).then((x)=>res.json(x)).catch((err)=>res.json(err))
})

app.post("/Cart", async (req, res) => {
  const { Title } = req.body;
  console.log(Title);
  await Cart.create({ Title });
});
app.post("/Register", async (req, res) => {
  const { Username, Password ,Role} = req.body;
  console.log(Username, Password,Role);
  if (!Username || !Password || !Role) {
    res.status(400);
    throw new Error("Please fill the all deatils");
  }
  const userexits = await User.findOne({ Username });
  if (userexits) {
    res.status(400);
    throw new Error("user already exits");
  }
  const salt = await Bcrypt.genSalt(10);
  const hashpassword = await Bcrypt.hash(Password, salt);
  const user = await User.create({
    Username,
    Password: hashpassword,
    Role,
  });
  if (user) {
    res.status(200).json({
      _id: user.id,
      Username: user.Username,
      Password: user.Password,
      token: genjwt(user.id),
      Role:user.Role
    });
   
  }
});
app.post("/Login", async (req, res) => {
  const { Username, Password } = req.body;
  console.log(Username);
  const userexits = await User.findOne({ Username });
  if (userexits && (await Bcrypt.compare(Password, userexits.Password))) {
    console.log(
       res.status(200).json({
        _id: userexits.id,
        Username: userexits.Username,
        Password: userexits.Password,
        token: genjwt(userexits.id),
      })
    );
    
  } else {
    res.status(400);
    // throw new Error("Invalid Login");
  }
});

app.listen(3001, () => {
  console.log("server is running");
});
const genjwt = (id) => {
  return jwt.sign({ id }, Private, {
    expiresIn: "30d",
  });
};
