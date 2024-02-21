const mongoose =require('mongoose');
 const user=new mongoose.Schema({
    Username:{type:String,required:true,unique:true},
    Password:{type:String,required:true},
    Uid:{type:String,required:true,unique:true},
    Role:{type:String,required:true},

 });
 const usermodel=mongoose.model("User",user);
 module.exports=usermodel;
 