import express from 'express';
import multer from 'multer';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import mailSender from '../email/email.mjs';
import employeemodel from '../model/employeemodel.mjs';
const secret='test';

// const router = express.Router();
// export const storage = multer.diskStorage({
//     destination: function (req,file,cb){
//         cb(null,'public/profile');

//     },
//     filename: function (req,file,cb){
//         const uniqueSuffix = Date.now();
//         cb(null,uniqueSuffix + file.originalname);
//     }, 
// });

// const upload = multer({storage:storage});
export const loginEmployee = async(req,res)=>{
   
    const {email, password}=req.body;
    try{
      
        const existingEmployee = await employeemodel.findOne({email});
        if(!existingEmployee)return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcryptjs.compare(password, existingEmployee.password) || existingEmployee.password == password;
        // const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        
        // const sec = secret+existingEmployee.password;
        // const token = jwt.sign({email:existingEmployee.email, id:existingEmployee._id},sec,{
        //     expiresIn:"5h",
        // });
       

         res.status(200).json({ result: existingEmployee}); 

    }catch(err){
        res.status(500).json({ message: "Something went wrong" });
        console.log(err.message);
    }
}
export const validateEmail = async(req,res)=>{
   
    const {email}=req.params;
    try{
      
        const existingEmployee = await employeemodel.findOne({email});
        // if(!existingEmployee)return res.status(404).json({ message: "User doesn't exist" });

        // const isPasswordCorrect = await bcryptjs.compare(password, existingEmployee.password) || existingEmployee.password == password;
        // // const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });
        // if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        
        // // const sec = secret+existingEmployee.password;
        // // const token = jwt.sign({email:existingEmployee.email, id:existingEmployee._id},sec,{
        // //     expiresIn:"5h",
        // // });
       
        
         res.status(200).json({ result: existingEmployee}); 

    }catch(err){
        res.status(500).json({ message: "Something went wrong" });
        console.log(err.message);
    }
}
export const createNewEmployee = async(req,res)=>{
    const {firstName,lastName,email,password,role,contactNumber,profilePicture} = req.body;
    console.log(password);
    try{
       // var dbo = db.dat
     
    //    const oldEmployee = await Employee.findOne({_id});
    //    if(oldEmployee) return res.status(400).json({message:'Staff already exist'});
        const hashedPassword = await bcryptjs.hash(password,12);
        const result = await employeemodel.create({firstName,lastName,email,role   ,password: hashedPassword,contactNumber,profilePicture });
        res.status(201).json({result});
    }
    catch(err){ 
        res.status(500).json({message: err.message}); 
        console.log(err);
    }
} 
export const getAllEmployee = async(req,res)=>{
    try{
        let result = await employeemodel.find();
        res.send(result).status(200);
    }catch(err){
        res.status(400).json({message:err.message});
    }
}
export const employeeForgotPassword = async(req,res)=>{
    const {email} = req.body;
    try{

        const oldUser = await employeemodel.findOne({email});
        console.log(email);

        if(!oldUser) return res.status(404).json({ message: "User doesn't exist" });

        const sec = secret+oldUser.password;
        const token = jwt.sign({email:oldUser.email, id:oldUser._id},sec,{
            expiresIn:"5m",
        });
        const link =`https://mrquickfixserver.onrender.com/mrquickfixemployee/reset-password/${oldUser._id}/${token}`;
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            `<!DOCTYPE html>
            <html lang="en" >
            <head>
                <meta charset="UTF-8">
                <title>Mr Qui - OTP Email</title>
            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick</a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>This is to ensure this account information. Click the link provided to complete your Change Password Procedure. This link will expire after 15 minutes</p>
                <a href=${link}>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">Click This link</h2></a>
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
            </html>`,
            []
        )
        console.log(link);
     return res.json({status:okay})
    }catch(err){
        return res.json({message:err})
    }
}
export const getEmployeeReset = async(req,res)=>{
    const {id,token} = req.params;
    console.log(req.params);
    const oldUser = await employeemodel.findOne({_id:id});
    if(!oldUser) return res.json({status:"User not found!"});
    const sec = secret+oldUser.password;
    try{
        const verify = jwt.verify(token,sec);
        res.render("index", { email: verify.email, status: "Not Verified" });
    }catch(err){ 
        res.send("Not Verify");
    }
}
export const savenewPassword = async(req,res)=>{
    const {id, token} = req.params;
      const { password } = req.body;

    const oldUser = await employeemodel.findOne({_id:id});
    if(!oldUser) return res.json({status:"User not found!"});
    const sec = secret+oldUser.password;
    try{
        const verify = jwt.verify(token,sec);    
       // res.send("Verified")
        const encryptedPassword = await bcryptjs.hash(password, parseInt(5, 10));
        // await Employee.findByIdAndUpdate(id,password);

        await employeemodel.updateOne(
            {
                _id:id, 
            },{ 
            $set:{
                password: encryptedPassword
            }
        }
        );
        res.render("index", { email: verify.email, status: "verified" });
      //  res.render("index", { email: verify.email, status: "verified" });
      //  console.log()
        
       // res.json({message:"password updated"});
    }catch(err){
        console.log(err);
        res.status(400).json({message:err})
    }
}
export const employeeRemove = async(req,res)=>{
    
    const {id} = req.params;
    try{
        // if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No id ');
        // const employeeid = {employeemodel._id:id}
        // await employeemodel.deleteOne(id);
        const oldUser = await employeemodel.findOne({_id:id});
        if(!oldUser) return res.json({status:"Employee not found"});
        await employeemodel.deleteOne(
            {
                _id:id
            }
       
        );
        res.status(200).json({message:"Deleted"});
    }catch(error){
        res.status(400).json({message:error})
        console.log(error)
    }

}

export const employeeUpdate = async(req,res)=>{
    const {id} = req.params;
    const {firstName,lastName,email,contactNumber,role} = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`Employee unknown`);
        const updateStaff = {firstName,lastName,role,contactNumber,email, _id: id};
        await employeemodel.findByIdAndUpdate(id, updateStaff,{new: true});
        res.status(200).json({message:"Updated"});
    }
    catch(err){
        res.status(400).json({err})
        console.log(err);
    }

}
export const UpdateSelfEmployee =async(req,res)=>{
    const {id}= req.params
    const {firstName,lastName,email,contactNumber,profilePicture} = req.body;
    try{
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`Invalid ID`);
        const updateStaff = {firstName,lastName,contactNumber,email,position,profilePicture, _id: id};
        await employeemodel.findByIdAndUpdate(id, updateStaff,{new: true});
        res.status(200).json({message:"Updated"});
    }
    catch(err){
        res.status(400).json({err})
        console.log(err);
    }
}

export const UpdateSelfPassword = async(req,res)=>{
    const {id} = req.params;
    const {password}= req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`Invalid ID`);

        const hashedPassword = await bcryptjs.hash(password,12);

        await employeemodel.updateOne({
            _id:id
        },{
            $set:{
                password:hashedPassword
            }
        })

    }catch(err){
        res.status(400).json({err})
        console.log(err);
    }
}



export const updateProfile =async(req,res)=>{
    const {id} = req.params;
    const {profilePicture} = req.body
    try{
        const currentEmployee = await employeemodel.findOne({_id:id});
        if(!currentEmployee) return res.status(404).json({message:"Employee not found"});

        await employeemodel.updateOne({
            _id:id
        },{ 
            $set:{
                profilePicture: profilePicture
            }
        });
        res.status(200).json({result:currentEmployee})
    }
    catch(err){
        res.status(500).json({message:err.message})
        console.log(err)
    }
}