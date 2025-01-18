const mongoose = require("mongoose");

const enrolledCourseSchema = new mongoose.Schema({
  UserId: {
    type: String,
    required: true,
  },
  CourseName: {
    type: String,
  },
  LastPassedM1Time: {
    type: Number,
  },
  LastPassedM2Time: {
    type: Number,
   
  },
  LastPassedM3Time: {
    type: Number,

  },
  Progress: {
    type: Number,
  },
}, { timestamps: true }); 

module.exports = mongoose.model("EnrolledCourse", enrolledCourseSchema);
