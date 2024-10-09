import mongoose from "mongoose";

const ProjectSchema = mongoose.Schema({
    projectName:{type: String,},
    category:{type:Array},
    thumbnail:{type:String},
    image:{type:Array},
    uploadedDate:{type:String,default:new Date()}
});
 
export default mongoose.model("projectcollection",ProjectSchema)