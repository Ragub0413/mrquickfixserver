import express, { response } from 'express';
import mongoose from "mongoose";
import File from '../model/filedocument.mjs';
import multer from 'multer';
import mailSender from "../email/email.mjs";
import employee from '../model/employeemodel.mjs';
import joborders from "../model/jobordermodel.mjs";
import filedocument from '../model/filedocument.mjs';
import { v2 as cloudinary } from 'cloudinary';
import { render } from 'ejs';

export const storageFile = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/file')
    },
    filename: function(req,file,cb){
        const uniqueSuffix = Date.now();
        cb(null,uniqueSuffix+file.originalname);
    }
});

export const storageFile1 = multer.memoryStorage();


const secret='test';

const router = express.Router();
const uploadFile = multer({storage:storageFile});



export const fileInprogressCompletedUpload = async(req,res)=>{
    const {documentFile,comment,jobordersId,joborderStatus,jobStatusUpdate} = req.body;
    try{
        const docuName = req.file.filename;
        const result = await File.create({documentFile:docuName,comment,jobordersId,joborderStatus,jobStatusUpdate})

        try{
            const ongoingTrans = joborders.findone({_id:jobordersId});
            if(!ongoingTrans) return res.json({status:"ID not found"});
            await joborders.updateOne({
                _id:jobordersId,
            },{
                $set:{
                    jobStatus: jobStatusUpdate
                }
            })
        }
        catch(err){
            console.log(err);
        }
        res.status(201).json({result});
    }
    catch(err){
        res.json({status: err});
    }
}

export const fileUpload = async (req,res)=>{
    const {documentFile,comment,jobordersId,joborderStatus,inspectionSchedule,jobAdminId, typeOfJob,
         jobCategory,
        jobStatusUpdate,jobStartDate,jobEndDate} = req.body;
    console.log(jobStatusUpdate)
    try{
        const docuName = req.file.filename;
        console.log(documentFile)
        const result = await File.create({documentFile:docuName,comment,jobordersId,joborderStatus,jobStartDate,jobEndDate});
       
        try{
            const ongoingTransaction = joborders.findOne({_id:jobordersId});
            if(!ongoingTransaction) return res.json({status:"ID not found"});

        
                //const jobStatusUpdate ='Completed'
                if(jobStatusUpdate === 'Complete'){
                    await joborders.updateOne({
                        _id:jobordersId,
                    },{
                        $set:{
                            jobStatus: jobStatusUpdate,
                           
                        } 
                    });
                }
               
                else{
                await joborders.updateOne({
                    _id:jobordersId,
                },{
                    $set:{
                        jobStatus: jobStatusUpdate,
                        dateStarted: jobStartDate,
                        dateEnded: jobEndDate,
                    } 
                });
            }
            //  }catch(err){
            //   //  res.json({status:err});
            //  }
           
        }catch(err){
           // res.json({status:err});
        }
     res.status(201).json({result});

    }catch(err){
        res.json({status:err});
    }
}

export const getFileUploaded = async(req,res)=>{
    try{
        let result = await filedocument.find();
        res.send(result).status(200);

    }catch(err){
        res.status(400).json({message:err.message});
        console.log(err);
    }
   
}

export const sendFileAttachment = async (req,res)=>{
    const {email,uploadedId,url,comment}= req.body;
  //  const {documentFile,id} = req.params;
    console.log(email);
    // console.log(fileattach)
    
    try{
       // const link = `http://localhost:5000/file${fileattach}`
        const existingFile = await filedocument.findOne({_id:uploadedId})
        if(!existingFile) return res.status(400).json({message:"File does not exist"});
       // console.log(documentFile)
         const mailResponse =await mailSender(
            email,
            "Mr. Quick Fix",
            `<!DOCTYPE html>
            <html lang="en" >
            <head>
                <meta charset="UTF-8">
                <title>Mr. Quick Fix Update Status</title>
                
            
            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick </a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Good Day! This email is to inform you that our staff will contact you for the next visitation and update for the project. </p>
                <p>Please be advice that we will contact you using the phone number that you provided.</p>
                 <p> Please see the attached file provided for this project. This is also serves as your copy. </p>
                
                <p style="font-size:0.9em;">Regards,<br />Mr. Quick Fix</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Mr Quick Fix PH</p>
                    <p>Philippines</p>
                </div>
                </div>
            </div>
            <!-- partial -->
                
            </body>
            </html>`,
            {
                filename: `${comment}.pdf`,
                path:url
                // link`http://localhost:5000/file/${documentFile}`
             }
        )
        return res.status(200).json({result})
    }catch(err){
        return res.json({err});
    }



}
export const completeStatus = async(req,res) =>{
    // const {email,jobordersId,comment,url,employeeHandle} = req.body;
    const {email,id} = req.params
  //  console.log(comment)
    try{
        const transaction = await joborders.findOne({_id:id});
        console.log(id);

        // const employees = await employee.findOne({_id:employeeHandle});
        // if(!employees) return res.json({status:"Employee Not Found"});

        // await employee.updateOne({
        //     _id:employeeHandle
        // },{
        //     $set:{
        //         adminhandle: 'None'
        //     }
        // });
        await joborders.updateOne({
            _id:id
        },{
            $set:{
                jobStatus: 'Completed'
            }
        });

        if(!transaction) return res.json({status:"Transaction Not Exists!"});
        const link = `https://mrquickfixserver.onrender.com/fileUpload/completetransaction/survey/${id}`;
        const mailResponse = await mailSender(
            email,
            "Mr. Quick Fix Complete Transaction",
            `<!DOCTYPE html>
            <html lang="en" >
            <head>
                <meta charset="UTF-8">
                <title>Mr. Quick Fix Status: Completed</title>
                
            
            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick </a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Good Day! This email is to inform you that your transaction with us is now completed. We already attached the last document for this project</p>
                <p>Hoping for another transaction with you! </p>
               
                <p>Hoping for you to take some time to answer the survey. This will help us improve. Your input is much appreciated. </p>
                <a href=${link}>Feedback</a>
                <p style="font-size:0.9em;">Regards,<br />Mr. Quick Fix</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Mr Quick Fix PH</p>
                    <p>Philippines</p>
                </div>
                </div>
            </div>
            <!-- partial -->
                
            </body>
            </html>`,
            // {
            //     filename: comment`.pdf`,
            //     path:url
            //     // link`http://localhost:5000/file/${documentFile}`
            //  }
            
        )
        console.log(link);
        res.status(201).json({result});
    }catch(err){
        return res.json(err);
    }

}

export const getSurvey = async(req,res)=>{
    const {id} = req.params;
    const transaction = await joborders.findOne({_id:id});
    if(!transaction) return res.json({status: "Transaction not found"});
    try{
      //  const verify = jwt.verify(token,secret);
      //  res.json({message:"Transaction Found!"})
        res.render("survey",{status:"Not Verified"})
    }
    catch(err){
        res.send("Not Verify");
    }
}
export const saveSurvey = async(req,res)=>{
    const {id}= req.params;
    const {clientSurvey} = req.body;
    const transaction = await joborders.findOne({_id:id});
    if(!transaction) return res.json({status:"Transaction not found!"});
    try{
        // const verify = jwt.verify(token,secret);
        await joborders.updateOne(
            {
                _id:id,
            },{
                $set:{
                    clientSurvey: clientSurvey
                }
            }
        );
        // render("survey",{Status:"Verified"});
        res.render("survey", {status: "verified" });
    }catch(err){
        console.log(err)
        res.json({status:"Something went wrong"})
    }
}

export const cancelStatus = async(req,res) =>{
    // const {jobStatusUpdate} = req.body;
    const {id,email} = req.params
    try{
        const transaction = await joborders.findOne({_id:id});
        console.log(id);
        if(!transaction) return res.json({status:"Transaction Not Exists!"});

       
            // const transaction = joborders.findOne({_id:jobordersId});
            await  joborders.updateOne({
                _id:id,
            },{
                $set:{
                    jobStatus: "Cancelled"
                }
            })
        // }
        // catch(err){
        //     console.log(err)
        // }
        const mailResponse = await mailSender(
            email,
            "Mr. Quick Fix",
            `<!DOCTYPE html>
            <html lang="en" >
            <head>
                <meta charset="UTF-8">
                <title>Mr. Quick Fix Status: Cancelled</title>
                
            
            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick </a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Good Day! We were sorry to inform you that your transaction with us will be cancelled and will not continue.</p>
               
                
                <p style="font-size:0.9em;">Regards,<br />Mr. Quick Fix</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Mr Quick Fix PH</p>
                    <p>Philippines</p>
                </div>
                </div>
            </div>
            <!-- partial -->
                
            </body>
            </html>`,
            
        )
        return res.json({status:okay})
    }catch(err){
        return res.json({message:err});
    }

}


export const fileCloud = async(req,res)=>{
    cloudinary.config({
        cloud_name:'dhkewdd7t',
        api_key:'466831814531458',
        api_secret:'QzD3d52eKtaYgmZMu8_RMYWLCC4'
    })
    const {documentFile,comment,jobordersId,joborderStatus,inspectionSchedule,jobAdminId, typeOfJob,
        jobCategory,
       jobStatusUpdate,jobStartDate,jobEndDate} = req.body;
    const docuName = req.file.originalname;
    const tyes = req.file.mimetype;
    const buffer = req.file.buffer;
    // try{
     
    const w = ({documentFile:docuName,tyes,buffer});
    console.log(w);
    docuName.split('.').slice(0, -1).join('.')
    // const datas = {url,public_id}
    try{
    const documentFiles = await new Promise((resolve,reject)=>{ cloudinary.uploader.upload_stream((err,result1)=>{
       if(err) throw err;

       const {url,public_id} = result1;
        // const url = cloudinary.url(public_id,{
        //     width:150,
        //     height:100,
        //     crop:'fill'
        // });
        const datas = {
            url: url,
            public_id: public_id
        }

        console.log(datas);
        resolve(result1)
        // res.status(201).json({result});
    },)
    .end(buffer);
        // let result = filedocument.create({documentFile:docuName,url:url,public_id:public_id,type:tyes,comment});
        // res.send(result).status(200);
        // console.log(result);
    
       
    })
    const {url,public_id} = documentFiles;
    const datas = {
        documentFile:docuName,
        comment:comment,
        url: url,
        public_id: public_id,
        type:tyes
    }
       // const result = filedocument.create({documentFile:docuName, url:documentFiles.url,public_id:documentFiles.public_id,type:tyes,comment});
 try{
    const result = await  filedocument.create({documentFile:docuName,url:documentFiles.url,public_id:documentFiles.public_id,type:tyes,comment});
     res.status(200).json({result})
 }
 catch(err){
    console.log(err)
 }
      
    const ongoingTransaction = joborders.findOne({_id:jobordersId});
    if(!ongoingTransaction) return res.json({status:"ID not found"});


        //const jobStatusUpdate ='Completed'
        if(jobStatusUpdate === 'Complete'){
            await joborders.updateOne({
                _id:jobordersId,
            },{
                $set:{
                    jobStatus: jobStatusUpdate,
                   
                } 
            });
        }
       
        else{
        await joborders.updateOne({
            _id:jobordersId,
        },{
            $set:{
                jobStatus: jobStatusUpdate,
                dateStarted: jobStartDate,
                dateEnded: jobEndDate,
            } 
        });
    }


   
    //const result = filedocument.create(datas)
   // res.status(200).json({result})
}
catch(err){
console.log(err)
}
//    console.log(result1)
        
        //  }catch(err){
        //   //  res.json({status:err});
        //  }
    
    // }catch(err){
    //    res.json({status:err});
    // }
    
    
   // console.log(data)
   //var upload_steam = cloudinary.v2.uploader.upload_steam()
}


 