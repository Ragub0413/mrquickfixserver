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
    const { image, projectName } = req.body;
   
  // const docname = req.files.originalname

   const buffer = req.file.buffer;
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
                        const datas = {
                            url: url,
                            // public_id: public_id
                        }
                        resolve(datas)
                    }).end(image.buffer);
                
                })
                return results;
            })
        
        });
        let uploads = await Promise.all(imageToUpload);
        console.log(uploads);
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
        const result = await project.create({projectName,image:uploads,thumbnail:documentFiles.url })
        res.status(200).json({result});

    }catch(err){
        res.status(400).json({message:err.message})
    }
    }
