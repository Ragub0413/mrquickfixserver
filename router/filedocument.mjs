import express from 'express';

import { getFileUploaded,storageFile,storageFile1, 
    sendFileAttachment, fileInprogressCompletedUpload, 
    completeStatus, getSurvey, cancelStatus, fileCloud, 
    saveSurvey } from '../controllers/fileController.mjs';
import { fileUpload } from '../controllers/fileController.mjs';
import multer from 'multer';
import { updateInspectionSched } from '../controllers/jobordercontroller.mjs';

const router = express.Router();
const upload = multer({storage:storageFile});
const upload1 = multer({storage:storageFile1});

router.post('/filedocument', upload.single("file"),fileUpload);
router.post('/sendFileAttached',sendFileAttachment);
router.get('/',getFileUploaded);
router.post('/uploadforInprocessandCompleted',fileInprogressCompletedUpload);
router.patch('/mailforcompletetransaction/:id/:email',completeStatus);
router.get('/completetransaction/survey/:id/',getSurvey);
router.post('/completetransaction/survey/:id',saveSurvey);
router.patch('/canceltransaction/:id/:email',cancelStatus);

router.post('/cloudupload',upload1.single("file"),fileCloud);


 
export default router;