import express from "express";
import multer from "multer";
import { storagemany, storageSingle, uploadManyImage } from "../controllers/projectController.mjs";

const router = express.Router();
const upload1 = multer({storage:storagemany});
const uploadS = multer({storage:storageSingle})

router.post('/postmany',uploadS.single("file"), upload1.array("image",10), uploadManyImage);
export default router