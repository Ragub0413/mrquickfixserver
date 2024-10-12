import otpGenerator from 'otp-generator';
import express from 'express';
import Otpmodel from '../model/otpmodel.mjs';
import Employee from '../model/employeemodel.mjs';
const router = express.Router();

export const sendOTP = async(req,res)=>{
    const {email}=req.params;
    try{    
       

        const checkUserPresent = await Employee.findOne({email});

        if(checkUserPresent){
            var otp = otpGenerator.generate(6,{ 
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            const result = await Otpmodel.findOne({otp:otp});
            console.log("Result is Generate OTP Func");
            console.log("OTP", otp);
            while(result){
                otp = otpGenerator.generate(6,{
                    upperCaseAlphabets: false,
                });
                // result = await Otpmodel.findOne({ otp: otp });
            }
            const otpPayload = { email, otp };
            const otpBody = await Otpmodel.create(otpPayload);
            console.log("OTP Body", otpBody);
            res.status(200).json({
                success: true,
                message: 'OTP sent successfully',
                otp,
              });
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Email not found"
            });
        }

     

    }catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
      }
}

export const autOTP = async(req,res) => {
    const {email} = req.params
    const {otp} = req.body;
    try{
      
        const response = await Otpmodel.find({email}).sort({createdAt: -1}).limit(1);
       // console.log(response)
        if(response.length===0){
            return res.status(400).json({
                success: false,
                message: 'OTP is not valid'
                
            })
        }
        else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
        }
        res.status(200).json({ result: response});
    }catch(error){
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}
