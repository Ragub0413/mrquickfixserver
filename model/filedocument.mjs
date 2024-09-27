import mongoose from "mongoose";

const DocumentSchema = mongoose.Schema({
    documentFile:{type:String,required:true},
    comment:{type:String},
    jobordersId:{type:String},
    joborderStatus:{type:String},
    jobStartDate:{type:String},
    jobEndDate:{type:String},
    url:{type:String},
    public_id:{type:String},
    type:{type:String},
    
}); 

export default mongoose.model("document-upload",DocumentSchema); 