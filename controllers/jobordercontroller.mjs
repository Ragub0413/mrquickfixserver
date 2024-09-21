import express from 'express';
import joborder from '../model/jobordermodel.mjs';

export const getAllJobOders = async (req,res)=>{
    try{
        let result = await joborder.find();
        res.send(result).status(200);
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
}
