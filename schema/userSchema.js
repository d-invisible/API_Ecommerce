import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,

    },
    email: {
        type: String,
        trim: true,
        unique: true,

    },
    googleId: {
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    orders: {
        type: Array,
        default: []
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    refreshToken: {
        type: String,
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;