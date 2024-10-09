import express from 'express';
import multer from 'multer';
import { getAllServices, newService, storage } from '../controllers/serviceController.mjs';

const router = express.Router();
const upload = multer({storage:storage});

router.post('/newService',upload.single("servicePhoto"),newService);
router.post('/',getAllServices);

export default router;