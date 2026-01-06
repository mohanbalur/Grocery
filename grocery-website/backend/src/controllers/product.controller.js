import cloudinary from "../config/cloudinary.js";
import Product from "../models/product.model.js";

// ADMIN: Add product


export const createProduct = async (req, res) => {
  try {
    // ✅ NO IMAGE → normal create
    if (!req.file) {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    }

    // ✅ IMAGE EXISTS → upload to cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const product = await Product.create({
      ...req.body,
      image: uploadResult.secure_url,
    });

    res.status(201).json(product);

  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ADMIN: Update product
export const updateProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      updateData.image = uploadResult.secure_url;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: err.message });
  }
};



// USER: Get products (with optional category filter)
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const products = await Product.find(filter)
      .populate("category", "name"); // optional but useful

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: Delete product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
