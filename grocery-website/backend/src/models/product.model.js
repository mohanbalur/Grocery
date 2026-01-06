import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },

    // ✅ category reference
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    image: { type: String },
    description: { type: String },
    stock: { type: Number, default: 0 },
 
    quantityValue: {
      type: Number,
      required: true,
    },

    quantityUnit: {
      type: String,
      enum: ["kg", "g", "piece", "ml", "l"],
      required: true,
    },
 
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
