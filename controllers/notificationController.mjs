import express from 'express';
import notificationmodel from '../model/notificationmodel.mjs';


export const saveNewdata = async(req,res)=>{
        const {clientsFirstName,clientsLastName,clientsConcern} = req.body
        try{
            const result = await notificationmodel.create({clientsFirstName,clientsLastName,clientsConcern});
            res.status(200).json(result);
        }
        catch(error){
            res.status(400).json({message:err.message})
        }
}
export const getAllData = async(req,res)=>{
    try{
        let result = await notificationmodel.find();
        res.send(result).status(200);
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

export const deleteService =async(req,res)=>{
    const {id} = req.params;
    try{
        const oldUser = await notificationmodel.findOne({_id:id});
        if(!oldUser) return res.json({status:"Service not found"});
        await notificationmodel.deleteOne(
            {
                _id:id
            }
       
        );
        res.status(200).json({message:"Deleted"});
    }catch(err){
        res.status(400).json({message:err})
        console.log(err)
    }
}

// export const editServices = async(req,res)=>{
//     const {id} = req.params;
//     const {serviceName,serviceDescription,servicePhoto} = req.body;
//     try{

        
//     }catch(err){
//         console.log(err)
//         res.status(500).json({message:err.message});
//     }
// }