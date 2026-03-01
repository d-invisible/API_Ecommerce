import dotenv from "dotenv";
dotenv.config({ path: './.env' });

import express from "express";
import mongoose from "mongoose";
import userRoutes from './routes/userRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import authRoutes from './routes/auth.js'
import './utils/passport.js'
import passport from 'passport';
import cookieParser from "cookie-parser";
import multer from "multer";

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));


const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use("/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/order", orderRoutes);

app.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ success: false, message: "Unexpected file field name. Expected 'category'" });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: "File size is too large. Expected 5MB" });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ success: false, message: "File count is too large. Expected 1" });
        }
    }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});