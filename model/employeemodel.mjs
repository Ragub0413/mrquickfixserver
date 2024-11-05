import mongoose from "mongoose";

const EmployeeSchema = mongoose.Schema({
    firstName:{type: String, required: true},
    lastName:{type:String, required: true},
    email:{type:String},
    password:{type:String},
    contactNumber:{type:String},
    role:{type:String},
    profilePicture:{type:String},
    adminhandle:{type:String},
    adminReadNotification:{type:Array},
    profilepicturepublickey:{type:String}
});
 
export default mongoose.model("sample-upload",EmployeeSchema)