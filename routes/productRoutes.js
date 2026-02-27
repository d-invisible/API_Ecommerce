import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { createProduct } from "../controllers/productController.js";

const router = express.Router();


router.post('/create', upload.array('product', 3), createProduct);

export default router;