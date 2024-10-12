import express from "express";
import multer from "multer";
import { deleteProject, getAllproject, storagemany, storageSingle, uploadManyImage } from "../controllers/projectController.mjs";

const router = express.Router();
const upload1 = multer({storage:storagemany});
const uploadS = multer({storage:storageSingle})


// router.post('/postmany',uploadS.single("file"),uploadthumnail)
router.post('/postmany',upload1.array("image",10), uploadManyImage);
router.get('/',getAllproject);
router.delete('/deleteproject/:id',deleteProject)
export default router