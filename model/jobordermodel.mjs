import mongoose from "mongoose";
const JobOrderSchema = mongoose.Schema({
    clientFirstName:{type: String},
    clientLastName:{type:String},
    email:{type:String},
    clientsAddress:{type:String},
    contactNumber:{type:String},
    typeOfJob:{type:String},
    jobCategory:{type:Array},
    jobQuotation:{type:String},
    jobQuotationLink:{type:String},
    jobQuotationpublickey:{type:String},
    jobStatus:{type:String},
    jobAdmin:{type:String},
    jobAdminId:{type:String},
    dateStarted:{type: String},
    dateEnded:{type: String},
    dateCancelled:{type:String},  
    clientSurvey:{type:String},
    clientConcern:{type:String}, 
    jobCompletion:{type:String},     
    feedbackDate:{type:String},
    inspectionSchedule:{type:String},
    notificationId:{type:String},
    inquiryDate:{type:String, default:new Date()},
    createdBy:{type:String},
    createdByEmployeeID:{type:String},
    updatedBy:{type:String},
    updatedByEmployeeID:{type:String},
    updateDate:{type:Date},
    statusAlert:{type:String}


    
    
});

export default mongoose.model("JobOrderCollection",JobOrderSchema)