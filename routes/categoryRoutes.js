import express from 'express';
import { createCategory, getAllCategory } from '../controllers/categoryController.js';
import upload from '../middlewares/uploadMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRole.js';

const router = express.Router();

router.post('/create', authMiddleware, checkRole('admin'), upload.single('category'), createCategory);
router.get('/all', getAllCategory);

export default router;
