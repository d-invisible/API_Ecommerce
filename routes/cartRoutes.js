import express from "express";
import { addProductToCart, clearCart, decProductQuantity, deleteProductFromCart, getCart, incProductQuantity } from "../controllers/cartController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/add", authMiddleware, addProductToCart);
router.post("/inc", authMiddleware, incProductQuantity);
router.post("/dec", authMiddleware, decProductQuantity);
router.delete("/delete", authMiddleware, deleteProductFromCart);
router.get("/get", authMiddleware, getCart);
router.delete("/clear", authMiddleware, clearCart);

export default router;
