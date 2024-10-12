import express from 'express';
import multer from 'multer';
import { deleteService, getAllServices, newService, storage } from '../controllers/serviceController.mjs';

const router = express.Router();
const upload = multer({storage:storage});

router.post('/newService',upload.single("servicePhoto"),newService);
router.get('/',getAllServices);
router.delete('/deleteservice',deleteService)

export default router;