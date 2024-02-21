const mongoose=require('mongoose');
const ProfileSchema=new mongoose.Schema({
    Username:{type:String, required:true,unique:true},
    Uid:{type:String, required:true,unique:true},
    Role:{type:String,default: "Mentor"},
    Photourl:{type:String,required:true,unique:true},
    EnrolledCourses:{type:String,value:[]},
    CompletedCourses:{type:String,value:[]},
    Cart:{type:Array,default:[]}
});
const Profile=mongoose.model("Profile",ProfileSchema);
 module.exports=Profile;