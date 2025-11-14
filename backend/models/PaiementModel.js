import mongoose from "mongoose";

const PaimentSchema = new mongoose.Schema({
userId : {type : mongoose.Schema.Types.ObjectId , required : true , ref : 'User'},
courseId : {type : mongoose.Schema.Types.ObjectId , required : true , ref : 'Course'},
montant : {type : Number , required : true},
provider : {type : String , enum : ["paypal" , "stripe"] , required : true},
transactionId : {type : String },
status : {type : String , enum : ["pending" ,"success" ,"failed" ] },
devise : {type : String , enum : ["USD" , "EUR" , "DH"]},
receiptUrl: { type: String },
paymentMethod: { type: String, enum: ["card", "paypal"] , required :false },
paidAt: { type: Date },
notes: { type: String },


},
{
    timestamps : true,
}
)
const Paiement = mongoose.model("Paiement" , PaimentSchema);
export default Paiement;