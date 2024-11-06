import express from 'express';
import multer from 'multer';
import { deleteService, editdetailsOnly, editServices, getAllServices, newService, storage } from '../controllers/serviceController.mjs';

const router = express.Router();
const upload = multer({storage:storage});

router.post('/newService',upload.single("servicePhoto"),newService);
router.get('/',getAllServices);
router.delete('/deleteservice/:id',deleteService);
router.patch('/updatewithphoto/:id/:serviceName',upload.single("servicePhoto"),editServices);
router.patch('/editdetails/:id/:serviceName',editdetailsOnly)

export default router;