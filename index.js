const Model = require("./models/Courses");
const Profile=require('./models/Profile');
const User = require("./models/user");
const Cart = require("./models/Cart");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const dotenv=require('dotenv')
const usermodel = require("./models/user");
dotenv.config();
app.use(express.json());
app.use(cors({
  credentials:false,
}));
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
  await User.create(req.body);
});
app.listen(process.env.port, () => {
  console.log("server is running");
});
