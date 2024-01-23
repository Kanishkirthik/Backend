const mongoose =require('mongoose');
 const user=new mongoose.Schema({
    Username:{type:String,required:true},
    Password:{type:String,required:true},
    Role:{type:String,required:true},
 });
 const usermodel=mongoose.model("User",user);
 module.exports=usermodel;
 