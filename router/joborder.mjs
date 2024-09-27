import express from 'express';

import { getAllJobOders,createNewJobOrder,getJobSearch,sentEmailForInspection,customerInquiry,UpdateStatusEmployee } from '../controllers/jobordercontroller.mjs';
const router = express.Router();

router.post('/newJobOrder', createNewJobOrder);
router.get('/jocollections',getAllJobOders);
router.get('/:id',getJobSearch)
router.post('/sendinspectionnotice',sentEmailForInspection);
router.post('/customerinquiry',customerInquiry);
router.patch('/:id/updatetransaction',UpdateStatusEmployee);
export default router;