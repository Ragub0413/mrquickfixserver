import mongoose from "mongoose";

const EmployeeSchema = mongoose.Schema({
    clientsFirstName:{type:String},
    clientsLastName:{type:String},
    clientsConcern:{type:String},
    inquiryDate:{type:String, default: new Date()}

});
 
export default mongoose.model("notification",EmployeeSchema)