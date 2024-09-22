import express from 'express'
import { createNewEmployee } from '../controllers/employeecontroller.mjs'
import multer from 'multer';
const router = express.Router();
// const upload = multer({storage:storage});
router.post('/createEmployee',createNewEmployee);

export default router;