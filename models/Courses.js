const mongoose=require('mongoose');
const schema = new mongoose.Schema({
  Name: { type: String, required: true,unique:true },
  Image: { type: String, required: true },
  Des: { type: String, required: true },
  M1Name: { type: String, required: true },
  M2Name: { type: String, required: true },
  M3Name: { type: String, required: true },
  M1Video: { type: String, required: true },
  M2Video: { type: String, required: true },
  M3Video: { type: String, required: true },
  Level: { type: String, required: true },
  Price: { type: String, required: true },
  Mentor:{ type: String, required: true },
  Rating:{type :Number,default:0}
});
module.exports = mongoose.model('Course', schema);

