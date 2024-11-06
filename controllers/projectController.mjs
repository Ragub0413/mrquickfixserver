import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary';
import pLimit from 'p-limit';
import project from '../model/project.mjs';
import FormData from 'form-data';

const secret='test';
export const storagemany = multer.memoryStorage();
export const storageSingle = multer.memoryStorage();
const upload = multer({storage:storagemany});


export const uploadManyImage = async(req,res)=>{
    cloudinary.config({
        cloud_name:'dhkewdd7t',
        api_key:'466831814531458',
        api_secret:'QzD3d52eKtaYgmZMu8_RMYWLCC4'
    })
    const {category, thumbnail,projectName } = req.body;
   
  // const docname = req.files.originalname


//console.log(req.files)
console.log(req.files.count)


try{
        const limit = pLimit(10);
        let imageBuff = req.files;
        let images =[];

        imageBuff.map((iB)=>{
            images.push(iB)
        })
        const imageToUpload = images.map((image)=>{
            return limit(async () =>{
                const results = await new Promise((resolve,reject)=>{
                    cloudinary.uploader.upload_stream((err,result1)=>{
                        if(err) throw err;
                        const {url,public_id} = result1;
                        const datas=url
                        resolve(datas)
                    }).end(image.buffer);
                
                })
                return results;
            })
        
        });
        let uploads = await Promise.all(imageToUpload);
        console.log(uploads);
        // const buffer = req.file.buffer;
        // const documentFiles = await new Promise((resolve,reject)=>{ cloudinary.uploader.upload_stream((err,result1)=>{
        //     if(err) throw err;
     
        //     const {url,public_id} = result1;
        //      const datas = {
        //          url: url,
        //          public_id: public_id
        //      }
     
        //      console.log(datas);
        //      resolve(result1)
        //  },)
        //  .end(buffer);
        //  })
        //  const {url,public_id} = documentFiles;
      const result = await project.create({projectName,category,image:uploads,thumbnail})
      // console.log({image:uploads})
        res.status(200).json({result});

    }catch(err){
        res.status(400).json({message:err.message})
    }
    }

export const getAllproject = async(req,res)=>{
    try{
    let result = await project.find();
    res.send(result).status(200)
    }
    catch(err){
        res.status(500).json({message: "Something went wrong"}); 
        console.log(err);
    }
}

export const deleteProject =async(req,res)=>{
    const {id} = req.params;
    try{
        const oldUser = await project.findOne({_id:id});
        if(!oldUser) return res.json({status:"Project not found"});
        await project.deleteOne(
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
export const editProject  =async(req,res) =>{
    cloudinary.config({
        cloud_name:'dhkewdd7t',
        api_key:'466831814531458',
        api_secret:'QzD3d52eKtaYgmZMu8_RMYWLCC4'
    })
    const {id} = req.params;
    const {thumbnail,projectName,category} = req.body; 

    try{
        const checkProject = await project.findOne({_id:id});
        if(!checkProject) return res.status(404).json({message:"Project not found"});
        const limit = pLimit(10);
        let imageBuff = req.files;
        let images =[];

        imageBuff.map((iB)=>{
            images.push(iB)
        })
        const imageToUpload = images.map((image)=>{
            return limit(async () =>{
                const results = await new Promise((resolve,reject)=>{
                    cloudinary.uploader.upload_stream((err,result1)=>{
                        if(err) throw err;
                        const {url,public_id} = result1;
                        const datas=url
                        resolve(datas)
                    }).end(image.buffer);
                
                })
                return results;
            })
        
        });
        let uploads = await Promise.all(imageToUpload);
        console.log(uploads);

        await project.updateOne({
            _id:id
        },{
            $set:{
               projectName: projectName,
               category:category,
               uploadedDate: new Date(),
               thumbnail: thumbnail,
               image:uploads
            }
        });
    
        res.status(200).json({checkProject})

    }catch(err){
        res.status(500).json({message:err.message})
        console.log(err)
    }
}


export const editDetails = async(req,res)=>{
    const {id} = req.params
    const {projectName,category,thumbnail} = req.body;
    try{
        const checkProject = await project.findOne({_id:id});
        if(!checkProject) return res.status(400).json({message:"Project not found"});
        await project.updateOne({
            _id:id
        },{
            $set:{
               projectName: projectName,
               category:category,
               uploadedDate: new Date(),
                thumbnail: thumbnail
            }
        });
        res.status(200).json({message:"Updated"})
    }
    catch(err){
        res.status(500).json({message:err.message})
        console.log(err);
    }
}

