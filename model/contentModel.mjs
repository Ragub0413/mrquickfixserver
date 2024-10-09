import mongoose from "mongoose";

const ContentSchema = mongoose.Schema({
   headline:{type:String, required:true},
   description:{type:String,required:true}
    
}); 

export default mongoose.model("content-update",ContentSchema); 