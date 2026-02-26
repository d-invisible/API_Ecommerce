import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { loginUserValidation, registerUserValidation } from "../middlewares/validateMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUserValidation, registerUser);
router.post("/login", loginUserValidation, loginUser);


router.get("/profile", authMiddleware, (req, res) => {
    res.json({ success: true, data: req.user });
});

export default router;