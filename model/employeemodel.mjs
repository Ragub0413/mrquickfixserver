import mongoose from "mongoose";

const EmployeeSchema = mongoose.Schema({
    firstName:{type: String, required: true},
    lastName:{type:String, required: true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    contactNumber:{type:String,required:true},
    role:{type:String,required:true},
    profilePicture:{type:String,required:true},
    adminhandle:{type:String}
});
 
export default mongoose.model("sample-upload",EmployeeSchema)