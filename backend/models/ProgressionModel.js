import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
studentId : {type : mongoose.Schema.Types.ObjectId , required : true ,  ref :  'User'},
courseId : {type :mongoose.Schema.Types.ObjectId  , required : true , ref : 'Course'},
completedChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],

quizScores: [{ quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, score: Number }],


progresspourcent : {type : Number , min : 0 , max :  100 , default : 0}


},
{
    timestamps : true ,
}
)
const Progress = mongoose.model("Progress" , ProgressSchema);
export default Progress;