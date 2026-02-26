import dotenv from "dotenv";
dotenv.config({ path: './.env' });

import express from "express";
import mongoose from "mongoose";
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/auth.js'
import './utils/passport.js'
import passport from 'passport';

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));


const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/auth", authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});