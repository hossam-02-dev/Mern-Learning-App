import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
title : {type :  String , required : true},
description : {type : String , required : true},
videos : [
{
title: String,
 url: String,
duration: Number
}
],
price : {type : Number , required : true},

studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],



},
{
timestamps : true,
}

);
const Course = mongoose.model("Course" , CourseSchema);
export default Course;