import mongoose from "mongoose";

const NotificationSchema = mongoose.Schema({
    clientsFirstName:{type:String},
    clientsLastName:{type:String},
    clientsConcern:{type:String},
    status:{type:String},
    inquiryDate:{type:String, default: new Date()}

});
 
export default mongoose.model("notification",NotificationSchema)