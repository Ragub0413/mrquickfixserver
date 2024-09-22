import express from 'express'
import { createNewEmployee,storage } from '../controllers/employeecontroller.mjs'
import multer from 'multer';
const router = express.Router();
const upload = multer({storage:storage});
router.post('/createEmployee',upload.single("profilePicture"),createNewEmployee);

export default router;