import express from 'express';
import multer from 'multer';

import { getAllJobOders,storageFile1,createNewJobOrder,getJobSearch,sentEmailForInspection,customerInquiry,UpdateStatusEmployee, createNewInspection, createNewJobOrders, updateInspectionSched, updateJobStatus, deleteCustomerInquiry, clientInquirytoInProgress, clientinquirytoOnProcess, filterComplete, onProcesstoInprogress, setnewActionStatus, updateEndDatewithFile, updateOnlyDateEnd } from '../controllers/jobordercontroller.mjs';
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
router.post('/clienttoinprocess/:id/:email/:employeeId',upload1.single("file"), clientInquirytoInProgress);
router.post('/clienttoonprocess/:id/:email',clientinquirytoOnProcess)
router.delete('/joborderdelete/:id/:email',deleteCustomerInquiry);  
router.post('/onprocesstoinprogress/:id/:email',upload1.single("file"),onProcesstoInprogress)     
router.get('/onlycompleted/:jobStatus', filterComplete)
router.post('/newAction/:id',setnewActionStatus);
router.patch('/inprogresswihfile/:id/:email',upload1.single("file"),updateEndDatewithFile);
router.patch('/inprogressnofile/:id/:email',updateOnlyDateEnd);
export default router; 