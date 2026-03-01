import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { addReview, createProduct, deleteProduct, getAllProducts, getProductById } from "../controllers/productController.js";
import checkRole from "../middlewares/checkRole.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post('/create', authMiddleware, checkRole('seller'), upload.array('product', 3), createProduct);
router.get('/all', getAllProducts);
router.get('/:id', getProductById);
router.delete('/:id', authMiddleware, checkRole('seller'), deleteProduct);
router.post('/:id/review', authMiddleware, addReview);

export default router;