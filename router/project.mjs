import express from "express";
import multer from "multer";
import { deleteProject, editDetails, editProject, getAllproject, storagemany, storageSingle, uploadManyImage } from "../controllers/projectController.mjs";

const router = express.Router();
const upload1 = multer({storage:storagemany});
const uploadS = multer({storage:storageSingle})


// router.post('/postmany',uploadS.single("file"),uploadthumnail)
router.post('/postmany',upload1.array("file",10), uploadManyImage);
router.get('/',getAllproject);
router.patch('/editdetails',editDetails);
router.patch('/editProject', upload1.array("file",10), editProject)
router.delete('/deleteproject/:id',deleteProject)
export default router