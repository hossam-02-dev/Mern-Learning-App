import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
courseId : {type :  mongoose.Schema.Types.ObjectId , required : true , ref : 'Course'},
title : {type : String , required : true},
questions: [
  {
    questionText: { type: String, required: true },
    options: { type: [String], required: true, validate: v => v.length >= 2 },
    correctAnswer: { type: String, required: true }
  }
],

duration : {type : Number , required : true},
points : {type : Number , required : true},
createdby : {type : mongoose.Schema.Types.ObjectId , ref : "User"},
isActive : {type : Boolean , required : true},




},
{
    timestamps : true,
}

)
const Quiz = mongoose.model("Quiz" , QuizSchema);
export default Quiz;