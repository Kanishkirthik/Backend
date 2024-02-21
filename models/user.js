const mongoose =require('mongoose');
 const user=new mongoose.Schema({
    Username:{type:String,required:true,unique:true},
    Email:{type:String,required:true,unique:true},
    Uid:{type:String,required:true,unique:true},
    Password:{type:String},
    Role:{type:String,default: "Mentor"},
    Photourl:{type:String,required:true,unique:true},
 });
 const usermodel=mongoose.model("User",user);
 module.exports=usermodel;
 