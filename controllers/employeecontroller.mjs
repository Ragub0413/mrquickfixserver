import express from 'express';
import multer from 'multer';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import employeemodel from '../model/employeemodel.mjs';
const secret='test';

const router = express.Router();
export const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'public/profile');

    },
    filename: function (req,file,cb){
        const uniqueSuffix = Date.now();
        cb(null,uniqueSuffix + file.originalname);
    }, 
});
const upload = multer({storage:storage});

export const createNewEmployee = async(req,res)=>{
    const {firstName,lastName,email,password,role,contactNumber,profilePicture} = req.body;
    console.log(firstName);
    try{
       // var dbo = db.dat
         const imageName = req.file.filename;
    //    const oldEmployee = await Employee.findOne({_id});
    //    if(oldEmployee) return res.status(400).json({message:'Staff already exist'});
        const hashedPassword = await bcryptjs.hash(password,12);
        const result = await employeemodel.create({firstName,lastName,email,role,password: hashedPassword,contactNumber,profilePicture:imageName });
        res.status(201).json({result});
    }
    catch(err){ 
        res.status(500).json({message:err}); 
        res
    }
} 
