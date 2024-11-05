import express, { response } from 'express';
import mongoose from "mongoose";
import contentModel from '../model/contentModel.mjs';
import notificationRead from '../model/notificationRead.mjs';

export const contentManagement = async(req,res)=>{
    const {headline,description}= req.body;
    try{
        const result = await contentModel.create({headline,description})
        res.status(200).json({result})
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}
export const displayNotification = async(req,res)=>{
    const {id} = req.params;
    try{
        const AdminId =await notificationRead.findOne({adminId:id});
        res.send(AdminId).status(200)
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:error.message})
    }
}
export const updateContents = async(req,res)=>{
    const {id} = req.params;
    const schedules = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Transaction with id: ${id}`);
        const updateContent = {...schedules,_id:id};
       await contentModel.findByIdAndUpdate(id,updateContent,{new: true})
        


        res.status(200).json({message:"Updated"});
    }
    catch(err){
        res.status(400).json({err})
        console.log(err)
    }
 
}
export const getAllContent = async(req,res)=>{
    try{
        let result = await contentModel.find();
        res.send(result).status(200);
    }catch(err){
        res.status(400).json({message:err.message});
    }
}
export const getContent = async(req,res)=>{
    const {id} = req.params
    try{
        let result = await contentModel.findOne({_id:id});
        res.send(result).status(200);
    }catch(err){
        res.status(400).json({message:err.message});
    }
}