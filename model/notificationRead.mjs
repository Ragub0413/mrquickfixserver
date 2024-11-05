import mongoose from "mongoose";

const ReadNotificationSchema = mongoose.Schema({
    adminId:{type:String},
    notification:{type:Array}

});
 
export default mongoose.model("notificationss",ReadNotificationSchema)