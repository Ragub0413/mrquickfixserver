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
    surveyDate:{type:String},
    inspectionSchedule:{type:String},
    inquiryDate:{type:String, default: new Date()}
    
});

export default mongoose.model("JobOrderCollection",JobOrderSchema)