import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import service from '../model/service.mjs';

export const storage = multer.memoryStorage();

export const newService = async(req,res)=>{
    cloudinary.config({
        cloud_name:'dhkewdd7t',
        api_key:'466831814531458',
        api_secret:'QzD3d52eKtaYgmZMu8_RMYWLCC4'
    })
    const {serviceName, serviceDescription} = req.body;
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
         const result = await service.create({serviceName,serviceDescription,servicePhoto:documentFiles.url});
         res.status(200).json({result})
    }
    catch(err){
        console.log(err);
        res.status(400).json({message: err.message})
    }
}
export const getAllServices = async(req,res)=>{
    try{
        let result = await service.find();
        res.send(result).status(200);
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

export const deleteService =async(req,res)=>{
    const {id} = req.params;
    try{
        const oldUser = await service.findOne({_id:id});
        if(!oldUser) return res.json({status:"Service not found"});
        await service.deleteOne(
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