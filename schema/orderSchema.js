import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            totalPrice: {
                type: Number,
                required: true
            }
        }
    ],
    totalProducts: {
        type: Number,
        required: true
    },
    totalCartPrice: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "UPI", "Credit Card", "Debit Card"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending"
    },
    status: {
        type: String,
        enum: ["pending", "inprocess", "completed", "cancelled"],
        default: "pending"
    },
    orderId: {
        type: String,
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    },
    cancelledAt: {
        type: Date,
        default: Date.now
    },

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;