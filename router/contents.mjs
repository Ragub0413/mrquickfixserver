import express from 'express'
import { contentManagement, getAllContent, getContent, updateContents } from '../controllers/contentController.mjs';

const router = express.Router();

router.post('/addContent',contentManagement);
router.patch('/updateContent/:id',updateContents)
router.get('/',getAllContent);
router.get('/:id',getContent);
export default router