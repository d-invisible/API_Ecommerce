import express from "express";
import { checkout, verifyPayment } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, checkout);
router.post("/verify", authMiddleware, verifyPayment);
// router.get("/", authMiddleware, getOrders);
// router.get("/:id", authMiddleware, getOrder);
// router.put("/:id", authMiddleware, updateOrder);

export default router;