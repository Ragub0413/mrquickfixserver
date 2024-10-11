import express from 'express';
import multer from 'multer';

import { getAllJobOders,storageFile1,createNewJobOrder,getJobSearch,sentEmailForInspection,customerInquiry,UpdateStatusEmployee, createNewInspection, createNewJobOrders, updateInspectionSched, updateJobStatus, deleteCustomerInquiry } from '../controllers/jobordercontroller.mjs';
const router = express.Router();
const upload1 = multer({storage:storageFile1});

router.post('/newJobOrder', createNewJobOrder);
router.get('/jocollections',getAllJobOders);
router.get('/:id',getJobSearch)
router.post('/sendinspectionnotice',sentEmailForInspection);
router.post('/customerinquiry',customerInquiry);
router.patch('/:id/updatetransaction',UpdateStatusEmployee);
router.patch('/updateSched/:id/:email',updateInspectionSched);
router.post('/createnewjoborder',upload1.single("file"), createNewJobOrders);
router.post('/updatejobStatus',upload1.single("file"), updateJobStatus);
router.delete('/joborderdelete/:id',deleteCustomerInquiry);       
export default router; 