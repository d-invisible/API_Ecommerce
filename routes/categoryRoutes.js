import express from 'express';
import { createCategory } from '../controllers/categoryController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/create', upload.single('category'), createCategory);

export default router;
