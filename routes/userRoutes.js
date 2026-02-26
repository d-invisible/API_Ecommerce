import express from "express";
import { registerUser, loginUser, refreshTokenHandler, logoutUser } from "../controllers/userController.js";
import { loginUserValidation, registerUserValidation } from "../middlewares/validateMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUserValidation, registerUser);
router.post("/login", loginUserValidation, loginUser);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logoutUser);


router.get("/profile", authMiddleware, (req, res) => {
    const user = req.user;
    res.json({ success: true, data: user });
});

export default router;