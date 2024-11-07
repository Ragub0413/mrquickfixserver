import express from 'express';
import joborder from '../model/jobordermodel.mjs';
import employeemodel from '../model/employeemodel.mjs';
import mailSender from '../email/email.mjs';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import notificationmodel from '../model/notificationmodel.mjs';
import jobordermodel from '../model/jobordermodel.mjs';
export const storageFile1 = multer.memoryStorage();
// dayjs.extend(utc);
//   dayjs.extend(timezone);
//   dayjs.tz.setDefault("Etc/GMT+8");


export const getAllJobOders = async (req,res)=>{
    try{
        let result = await joborder.find();
        res.send(result).status(200);
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
}
export const getJobSearch = async (req,res)=>{
    const {id} = req.params;

    try{
      const cInfo = await joborder.findById(id);
      res.status(200).json(cInfo);
    }
    catch(error){
      res.status(404).json({message: error.message});
    }
  }
export const customerInquiry = async(req,res)=>{
    const {clientFirstName,clientLastName,email,contactNumber,clientConcern,createdBy,jobStatus} = req.body
    const notifId=''
    try{
        let date = new Date();
        date = date.toUTCString();

            const result = await joborder.create({
                clientFirstName, clientLastName, email, createdBy,
                contactNumber,clientConcern,jobStatus,inquiryDate:date+''
            })
   
          console.log(result)

        const mailResponse =await mailSender(
            email,
            "Mr. Quick Fix",
            `<!DOCTYPE html>
            <html lang="en" >
            <head>
                <meta charset="UTF-8">
                <title>Mr. Quick Fix</title>


            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick </a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Good Day! We received your inquiry.  </p>
                <p>Please be advice that we will contact you using the phone number that you provided.</p>
                 <p> Thank you for trusting Mr. Quick Fix </p>

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
            </html>`)
       res.status(201).json({result});

    }catch(err){
        res.status(400).json({message:err.message})
    }
}

export const setnewActionStatus = async (req, res)=>{
    const {id}= req.params;
    //const {actionStatus} = req.body;
    try{

        const jobOrder = joborder.findOne({_id:id});
        if(!jobOrder) return res.status(400).json({message:"This Job Transaction is not available"});
        await jobOrder.updateOne({
            _id:id
        },{
            $set:{
                statusAlert:'Started'
            }
        })
        res.status(200).json({message:"Updated Status"})
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}
export const sentEmailForInspection = async (req,res)=>{
    const {clientFirstName,clientLastName,email,clientsAddress,typeOfJob,jobCategory,jobStatus,
        contactNumber,createdBy,createdByEmployeeID,dateStarted,dateEnded, inspectionSchedule
    } = req.body;
    try{ let date = new Date();
        date = date.toUTCString();
        const result = await joborder.create({clientFirstName,clientLastName,email,clientsAddress,typeOfJob,jobCategory,jobStatus,
            contactNumber,createdBy,createdByEmployeeID,dateStarted,dateEnded,inspectionSchedule, inquiryDate:date+''
        });


        const sched = new Date(inspectionSchedule).toLocaleDateString();
        console.log(sched);
        const mailResponse = await mailSender(
            email,
            "Mr Quick Inspection Notice",
            `<!DOCTYPE html>
            <html lang="en" >
            <head>
                <meta charset="UTF-8">
                <title>Mr Quick Schedule for Inspection</title>


            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick Inspection Schedule</a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>This email is to inform you that you have schedule for occular inspection with us at ${sched}</p>
                <p>Please be advice that we will contact you using the phone number that you provided.</p>
                 <p> </p>

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
        )
        res.status(200).json({result});
    }
    catch(err){
        res.status(404).json({message:err.message})
    }
}
export const createNewJobOrder =async(req,res)=>{
    const {clientFirstName,clientLastName,email,clientsAddress,typeOfJob,jobCategory,jobStatus,
        contactNumber,jobAdmin,dateStarted,dateEnded,jobAdminId,
    } = req.body;

    try{

        const result = await joborder.create({clientFirstName,clientLastName,email,clientsAddress,typeOfJob,jobCategory,jobStatus,
            contactNumber,jobAdmin,dateStarted,dateEnded,jobAdminId
        });

        const employees = employeemodel.findOne({_id:jobAdminId});
        if(!employees) return res.json({status:"Admin not found"});
        await employeemodel.updateOne({
            _id:jobAdminId
        },{
            $set:{
                adminhandle: 'Yes'
            }
        });


        const mailResponse =await mailSender(
            email,
            "Mr. Quick Fix",
            `<!DOCTYPE html>
            <html lang="en" >
            <head>
                <meta charset="UTF-8">
                <title>Mr. Quick Fix</title>


            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick </a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Good Day! This email is to inform you that our staff will contact you for the next visitation for the project. </p>
                <p>Please be advice that we will contact you using the phone number that you provided.</p>
                 <p> Thank you for trusting Mr. Quick Fix </p>

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
            </html>`)
        res.status(201).json({result});

    }catch(err){
        res.status(500).json({message:'Something went wrong'});
        console.log(err);
    }
}
export const UpdateStatusEmployee = async(req,res)=>{
    const {id} = req.params;
    const schedules = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Transaction with id: ${id}`);
        const updatetransaction = {...schedules,_id:id};
       await joborder.findByIdAndUpdate(id,updatetransaction,{new: true})



        res.status(200).json({message:"Updated"});
    }
    catch(err){
        res.status(400).json({err})
        console.log(err)
    }

}

export const createNewInspection = async (req,res) =>{
     const {clientFirstName,clientLastName,email,clientsAddress,typeOfJob,jobCategory,jobStatus,  dateStarted,
        dateEnded,
        contactNumber, inspectionSchedule,jobAdmin, jobQuotation,inquiryDate
    } = req.body;

}
export const updateInspectionSched = async(req,res)=>{
    const {id,email} = req.params;
    const {inspectionDate, updatedBy,updatedByEmployeeID} = req.body
    try{
        let date = new Date();
        date = date.toUTCString();
    const JobOrder = joborder.findOne({_id:id});
    if(!JobOrder) return res.json({status:"Job Order Not found"});
    await joborder.updateOne({
        _id:id 
    },{
        $set:{
            inspectionSchedule: inspectionDate,
            updatedBy: updatedBy,
            updatedByEmployeeID: updatedByEmployeeID,
            updateDate: date+''
        }
    });
    const sched = inspectionDate
    console.log(sched);
    const mailResponse = await mailSender(
        email,
        "Mr Quick Inspection Notice",
        `<!DOCTYPE html>
        <html lang="en" >
        <head>
            <meta charset="UTF-8">
            <title>Mr Quick Schedule for Inspection</title>


        </head>
        <body>
        <!-- partial:index.partial.html -->
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick Inspection Schedule</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>This email is to inform you that your schedule for occular inspection with us has been changed. The updated date will be on ${sched}</p>
            <p>Please be advice that we will contact you using the phone number that you provided.</p>
             <p> </p>

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
    )

    res.status(200).send("Sent Email and updated inspection date")
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}
export const updateJobStatus = async(req,res)=>{
    cloudinary.config({
        cloud_name:'dhkewdd7t',
        api_key:'466831814531458',
        api_secret:'QzD3d52eKtaYgmZMu8_RMYWLCC4'
    })
    const {id,email} = req.params;
    const {dateStarted,dateEnded} = req.body
    const docuNmae =req.file.orignalname;
    try{
    const JobOrder = joborder.findOne({_id:id});
    if(!JobOrder) return res.json({status:"Job Order Not found"});
    const buffer = req.file.buffer;
    const documentFiles = await new Promise((resolve,reject)=>{ cloudinary.uploader.upload_stream((err,result1)=>{
        if(err) throw err;

        const {url,public_id} = result1;
         const datas = {
             url: url,
             public_id: public_id
         }

         console.log(datas);
         resolve(result1)
     },)
     .end(buffer);
     })
     const {url,public_id} = documentFiles;
    await joborder.updateOne({
        _id:id
    },{
        $set:{
            jobQuotation:docuNmae,
            jobQuotationLink: documentFiles.url,
            jobQuotationpublickey: documentFiles.public_id,
        }
    });
    const sched = inspectionDate
    console.log(sched);
    const mailResponse = await mailSender(
        email,
        "Mr Quick Inspection Notice",
        `<!DOCTYPE html>
        <html lang="en" >
        <head>
            <meta charset="UTF-8">
            <title>Mr Quick Schedule for Inspection</title>


        </head>
        <body>
        <!-- partial:index.partial.html -->
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick Inspection Schedule</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>This email is to inform you that your schedule for occular inspection with us has been changed. The updated date will be on ${sched}</p>
            <p>Please be advice that we will contact you using the phone number that you provided.</p>
             <p> </p>

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
    )
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}
export const createNewJobOrders = async (req,res)=>{
    cloudinary.config({
        cloud_name:'dhkewdd7t',
        api_key:'466831814531458',
        api_secret:'QzD3d52eKtaYgmZMu8_RMYWLCC4'
    })
    
    const {clientFirstName,clientLastName,email,clientsAddress,typeOfJob,jobCategory,jobStatus,  dateStarted,
        dateEnded,
        contactNumber, inspectionSchedule,createdBy, createdByEmployeeID, jobQuotation,inquiryDate
    } = req.body;
    let date = new Date();
    date = date.toUTCString();
    const docuNmae =req.file.orignalname;
    const types = req.file.mimetype;
    const buffer = req.file.buffer;
    try{
        const documentFiles = await new Promise((resolve,reject)=>{ cloudinary.uploader.upload_stream((err,result1)=>{
           if(err) throw err;

           const {url,public_id} = result1;
            const datas = {
                url: url,
                public_id: public_id
            }

            console.log(datas);
            resolve(result1)
        },)
        .end(buffer);
        })
        const {url,public_id} = documentFiles;
        const datas = {
            jobQuotation:docuNmae,
            jobQuotationLink: url,
            jobQuotationpublickey: public_id,
            type:types
        }
        console.log(datas)
        try{
            const result = await joborder.create({jobQuotation:docuNmae,jobQuotationLink: documentFiles.url,jobQuotationpublickey: documentFiles.public_id,
                clientFirstName,clientLastName,email,
                clientsAddress,
                contactNumber,
                createdBy,
                createdByEmployeeID,
                dateStarted,
                dateEnded,
                typeOfJob,
                jobCategory,
                jobStatus,
                inquiryDate:date+''
                
            })
            console.log(result);
            const mailResponse =await mailSender(
                email,
                "Mr. Quick Fix",
                `<!DOCTYPE html>
                <html lang="en" >
                <head>
                    <meta charset="UTF-8">
                    <title>Mr. Quick Fix PH</title>


                </head>
                <body>
                <!-- partial:index.partial.html -->
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick </a>
                    </div>
                    <p style="font-size:1.1em">Hi,</p>
                    <p>Good Day! This email is to inform you that our staff will contact you  for the visitation date and other updated for your inquiry </p>
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
                    filename: docuNmae,
                    path:documentFiles.url
                    // link`http://localhost:5000/file/${documentFile}`
                 }
            )
            res.status(200).json({result})
        }
        catch(err){
            console.log(err);

        }

    }
        catch(err){
            console.log(err)
        }
}

export const updateEndDatewithFile = async (req,res)=>{
    cloudinary.config({
        cloud_name:'dhkewdd7t',
        api_key:'466831814531458',
        api_secret:'QzD3d52eKtaYgmZMu8_RMYWLCC4'
    })
    const {id,email} = req.params;
    const {endDate,updatedBy,updatedByEmployeeID} = req.body;
    let date = new Date();
        date = date.toUTCString();
    try{
        const inprogressData = await joborder.findOne({_id:id});
        const docuNmae =req.file.orignalname;
        if(!inprogressData) return res.status(400).json({message:"No available data"})
        const docuID = inprogressData.jobQuotationpublickey;
        if(docuID){
            await cloudinary.uploader.destroy(docuID)
        }

        const buffer = req.file.buffer;
       const docuUpdate = await new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream((err,result1)=>{
            if(err) throw err;
            
        const {url,public_id} = result1;
        const datas = {
            url: url,
            public_id: public_id
        }
        console.log(datas);
        resolve(result1)
        },)
        .end(buffer)
       })

       await jobordermodel.updateOne({
        _id:id
       },{
        $set:{
            jobQuotationLink: docuUpdate.url,
            jobQuotationpublickey: docuUpdate.public_id,
            jobQuotation: docuNmae,
            dateEnded: endDate,
            updatedBy:updatedBy,
            updatedByEmployeeID:updatedByEmployeeID,
            updateDate: date+''
        }
       })
       const mailResponse =await mailSender(
        email,
        "Mr. Quick Fix",
        `<!DOCTYPE html>
        <html lang="en" >
        <head>
            <meta charset="UTF-8">
            <title>Mr. Quick Fix PH</title>


        </head>
        <body>
        <!-- partial:index.partial.html -->
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick Project Update</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Good Day! This email is to inform you that your project with us was adjusted.
            This project starts at ${inprogressData.dateStarted} and the new end date will be on ${endDate}</p>
            <p>Please be advice that we will contact you with other details using the phone number that you provided.</p>
             <p>The file attached is the <b>Quotation File</b> of this project. This will also served as your copy. </p>
             <p>Thank you for trusting Mr. Quick Fix!</p>

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
            filename: 'Quotation',
            path:docuUpdate.url
            // link`http://localhost:5000/file/${documentFile}`
         }
    )
    res.status(200).json({message:"Updated In Progress Data"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err.message})
    }
}
export const updateOnlyDateEnd = async(req,res)=>{
    const {id,email} = req.params;
    const {endDate,updatedBy, updatedByEmployeeID} = req.body;
    let date = new Date();
        date = date.toUTCString();
    try{
        const inprogressDatas = joborder.findOne({_id:id});
        if(!inprogressDatas) return res.status(400).json({message:"no data found"});
        await joborder.updateOne({
            _id:id
        },{
            $set:{
                dateEnded: endDate,
                updatedBy:updatedBy,
                updatedByEmployeeID:updatedByEmployeeID,
                updateDate: date+''
            }
        })
        const mailResponse =await mailSender(
            email,
            "Mr. Quick Fix",
            `<!DOCTYPE html>
            <html lang="en" >
            <head>
                <meta charset="UTF-8">
                <title>Mr. Quick Fix PH</title>
    
    
            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick Project Update</a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Good Day! This email is to inform you that your project with us was adjusted.
                The project new end date will be on ${endDate}</p>
                <p>Please be advice that we will contact you with other details using the phone number that you provided.</p>
                 <p> We will be using the same Quotation for this project as what we discuss on phone. Thank you!
    
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
            </html>`
            ,
            {
                filename:inprogressDatas.jobQuotation,
                path: inprogressDatas.jobQuotationLink
                // link`http://localhost:5000/file/${documentFile}`
             }
        )
        
        res.status(200).json({message:"Updated Data"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err.message})
    }
}
export const deleteCustomerInquiry= async(req, res)=>{
    const {id,email} = req.params
    try{
        const customerInquiry = await joborder.findOne({_id:id})
        if(!customerInquiry) return res.json({status:"Invalid job order id "});

        await joborder.deleteOne(
            {
                _id:id
            }
        );
        const mailResponse =await mailSender(
            email,
            "Mr. Quick Fix",
            `<!DOCTYPE html>
            <html lang="en" >
            <head>
                <meta charset="UTF-8">
                <title>Mr. Quick Fix Customer Unresponsive Notice</title>


            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick Unresponsive </a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Good Day! This email is to inform you that we tried to contact you
                for 3-5 times to inform you about the process and other details to continue the project. </p>
                 <p>Unfortunately we decided to remove your inquiry to our list due to being unresponsive. You can submit your inquiry again to
                 our website or directly message us to our social media accounts. Thank you!</p>

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
            //     filename: docuNmae,
            //     path:documentFiles.url
            //     // link`http://localhost:5000/file/${documentFile}`
            //  }
        )
        res.status(200).json({message:"Delete INQUIRY"})
    }
    catch(error){
        res.status(400).json({message:error.message})
        console.log(error)
    }
}

export const clientInquirytoInProgress = async(req,res)=>{
    cloudinary.config({
        cloud_name:'dhkewdd7t',
        api_key:'466831814531458',
        api_secret:'QzD3d52eKtaYgmZMu8_RMYWLCC4'
    })
    let date = new Date();
    date = date.toUTCString();
    const {id,email, employeeId} = req.params
    const {contactNumber,clientsAddress,dateStarted,dateEnded,typeOfJob,jobCategory,updatedBy,updatedByEmployeeID } = req.body;
    const docuNmae =req.file.orignalname;
    try{
    const JobOrder = joborder.findOne({_id:id});
    if(!JobOrder) return  res.status(404).send("Job order not found");
    const Employee = employeemodel.findOne({_id:employeeId})
    if(!Employee) return  res.status(404).send("Employee not found");
    // const notifys = Employee.adminReadNotification
    // if(notifys){
    //     for(var i = 0; i <= notifys.length; i++){
    //         if(notifys[i] === id){
    //             let splice = notifys.splice(i,1);
    //             console.log(splice);
    //             console.log(notifys)
    //         }
    //     }
    // }
    // console.log(notifys)
    await employeemodel.updateOne({
        _id: employeeId
    },{
        $set:{
            adminReadNotification:[]
        }
    })

    const buffer = req.file.buffer;
    const documentFiles = await new Promise((resolve,reject)=>{ cloudinary.uploader.upload_stream((err,result1)=>{
        if(err) throw err;

        const {url,public_id} = result1;
         const datas = {
             url: url,
             public_id: public_id
         }

         console.log(datas);
         resolve(result1)
     },)
     .end(buffer);
     })
    await joborder.updateOne({
        _id:id
    },{
        $set:{
            jobStatus: 'In Progress',
            clientsAddress:clientsAddress,
            contactNumber:contactNumber,
            jobQuotation:docuNmae,
            jobQuotationLink: documentFiles.url,
            jobQuotationpublickey: documentFiles.public_id,
            dateStarted:dateStarted,
            dateEnded:dateEnded,
            jobCategory:jobCategory,
            typeOfJob: typeOfJob,
            updatedBy: updatedBy,
            updatedByEmployeeID: updatedByEmployeeID,
            updateDate: date+''

        }
    });
    const mailResponse =await mailSender(
        email,
        "Mr. Quick Fix",
        `<!DOCTYPE html>
        <html lang="en" >
        <head>
            <meta charset="UTF-8">
            <title>Mr. Quick Fix PH</title>


        </head>
        <body>
        <!-- partial:index.partial.html -->
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick Project Update</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Good Day! This email is to inform you that we already <b>In Progress</b> with this project.
            This project starts at ${dateStarted} and end at ${dateEnded}</p>
            <p>Please be advice that we will contact you with other details using the phone number that you provided.</p>
             <p>The file attached is the <b>Quotation File</b> of this project. This will also served as your copy. </p>
             <p>Thank you for trusting Mr. Quick Fix!</p>

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
            filename: docuNmae,
            path:documentFiles.url
            // link`http://localhost:5000/file/${documentFile}`
         }
    )
    res.status(200).send("Updated Module")
}
catch(err){
    return res.status(400).json({message:err.message})
}

}
export const clientinquirytoOnProcess = async(req,res)=>{
    const {id,email} = req.params;
    const {inspectionSchedule,clientsAddress,jobCategory,contactNumber,updatedBy,updatedByEmployeeID, typeOfJob} = req.body;
try{
    let date = new Date();
    date = date.toUTCString();

    const mailResponse = await mailSender(
        email,
        "Mr Quick Inspection Notice",
        `<!DOCTYPE html>
        <html lang="en" >
        <head>
            <meta charset="UTF-8">
            <title>Mr Quick Schedule for Inspection</title>


        </head>
        <body>
        <!-- partial:index.partial.html -->
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick Inquiry Update</a>
            </div>
            <p style="font-size:1.1em">Hi</p>
            <p>This email is to inform you that your inquiry is already <b>On process</b> and you have schedule for occular inspection with us at ${inspectionSchedule}. </p>
                <p>Please be advice that we will contact you using the phone number that you provided.</p>
                 <p> Thank you for trusting Mr. Quick Fix!</p>

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
    )
    await joborder.updateOne({
        _id:id
    },{
        $set:{
            jobStatus:'On Process',
            inspectionSchedule:inspectionSchedule,
          clientsAddress: clientsAddress,
          jobCategory: jobCategory,
          typeOfJob: typeOfJob,
          contactNumber: contactNumber,
          updatedBy: updatedBy,
          updatedByEmployeeID: updatedByEmployeeID,
          updateDate: date+''

        }
    });
    res.status(201).send("Updated Data");
}
catch(err){
    return res.status(400).json({message:json})
}
}
export const onProcesstoInprogress = async(req,res)=>{
    cloudinary.config({
        cloud_name:'dhkewdd7t',
        api_key:'466831814531458',
        api_secret:'QzD3d52eKtaYgmZMu8_RMYWLCC4'
    })
    let date = new Date();
        date = date.toUTCString();
    const {id,email} = req.params
    const {dateStarted,dateEnded,updatedBy, updatedByEmployeeID} = req.body;
    const docuNmae = req.file.originalname;
    try{
        const JobOrder = joborder.findOne({_id:id});
        if(!JobOrder) return  res.status(404).send("Job order not found");
        const buffer = req.file.buffer;
        const documentFiles = await new Promise((resolve,reject)=>{ cloudinary.uploader.upload_stream((err,result1)=>{
            if(err) throw err;

            const {url,public_id} = result1;
             const datas = {
                 url: url,
                 public_id: public_id
             }

             console.log(datas);
             resolve(result1)
         },)
         .end(buffer);
         })

         await joborder.updateOne({
            _id:id
        },{
            $set:{
                jobStatus: 'In Progress',

                jobQuotation:docuNmae,
                jobQuotationLink: documentFiles.url,
                jobQuotationpublickey: documentFiles.public_id,
                dateStarted:dateStarted,
                dateEnded:dateEnded,
                updatedBy:updatedBy,
                updatedByEmployeeID: updatedByEmployeeID,
                updateDate: date+''

            }
        });
        const mailResponse =await mailSender(
            email,
            "Mr. Quick Fix",
            `<!DOCTYPE html>
            <html lang="en" >
            <head>
                <meta charset="UTF-8">
                <title>Mr. Quick Fix PH</title>


            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick Project Update</a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Good Day! This email is to inform you that we already <b>In Progress</b> with this project.
                This project starts at ${dateStarted} and end at ${dateEnded}</p>
                <p>Please be advice that we will contact you with other details using the phone number that you provided.</p>
                 <p>The file attached is the <b>Quotation File</b> of this project. This will also served as your copy. </p>
                 <p>Thank you for trusting Mr. Quick Fix!</p>

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
                filename: docuNmae,
                path:documentFiles.url
                // link`http://localhost:5000/file/${documentFile}`
             }
        )

        res.status(200).send("Updated Module")

    }
    catch(error){
       res.status(400).json({message:error.message})
    }

}



export const filterComplete = async(req,res)=>{
    const {jobStatus} = req.params;

    try{
        let result = joborder.find({jobStatus:jobStatus});
        //if(!jobs) return res.status(400).send("This Job status is invalid");
        res.send(result).status(200);
    }
    catch(err){
        return res.status(400).json({message:err.message})
    }
}