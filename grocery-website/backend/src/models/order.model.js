import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity:{
          type: Number,
          required: true,
         },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },

    deliveryDetails: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
    },

    // 🆕 PAYMENT INFO (SIMULATION)
    paymentMethod: {
      type: String, // ONLINE / COD
    },

    paymentStatus: {
      type: String,
      default: "Pending", // Pending, Paid
    },
    
    status: {
      type: String,
      default: "Placed", // Placed, Shipped, Delivered
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
