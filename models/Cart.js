const mongoose =require('mongoose');
const cartSchema= new mongoose.Schema({
    Title:{type:String,required:true},
 });
 const Cart=mongoose.model("Cart",cartSchema);
 module.exports=Cart;