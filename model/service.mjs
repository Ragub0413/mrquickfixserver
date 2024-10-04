import mongoose from "mongoose";

const ServiceSchema = mongoose.Schema({
    serviceName:{type: String, required: true},
    servicePhoto:{type:String}
});
 
export default mongoose.model("services",ServiceSchema)