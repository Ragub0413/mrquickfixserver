import express from 'express';
import multer from 'multer';

import { getAllJobOders,storageFile1,createNewJobOrder,getJobSearch,sentEmailForInspection,customerInquiry,UpdateStatusEmployee, createNewInspection, createNewJobOrders } from '../controllers/jobordercontroller.mjs';
const router = express.Router();
const upload1 = multer({storage:storageFile1});

router.post('/newJobOrder', createNewJobOrder);
router.get('/jocollections',getAllJobOders);
router.get('/:id',getJobSearch)
router.post('/sendinspectionnotice',sentEmailForInspection);
router.post('/customerinquiry',customerInquiry);
router.patch('/:id/updatetransaction',UpdateStatusEmployee);
router.post('/createnewjoborder',upload1.single("file"), createNewJobOrders);
export default router; 