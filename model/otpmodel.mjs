import mongoose from "mongoose";
import mailSender from "../email/email.mjs";     

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
      },
      otp: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
      },
});

async function sendVerificationEmail(email,otp) {
    try{
        const mailResponse = await mailSender(
            email,
            "Verification Email",
           `<!DOCTYPE html>
  <html lang="en" >
  <head>
    <meta charset="UTF-8">
    <title>CodePen - OTP Email Template</title>
    
  
  </head>
  <body>
  <!-- partial:index.partial.html -->
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>This is to ensure this account information. Use this following OTP to Log in. OTP is valid for 5 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />Mr. Quick</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Mr Quick PH</p>
        <p>Philippines</p>
      </div>
    </div>
  </div>
  <!-- partial -->
    
  </body>
  </html>`
        );
        console.log("Email send successfully: ", mailResponse);

    }
    catch(err){
        console.log("Error occured while sending email: ", err);
        throw err;
    }
}
otpSchema.pre("save",async function (next){
    console.log("New Document saved to the database");
    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp);
    }
    next();
});
export default mongoose.model("otpverification",otpSchema);