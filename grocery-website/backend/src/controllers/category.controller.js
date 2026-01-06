import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;

  const exists = await Category.findOne({ name });
  if (exists) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const category = await Category.create({ name });
  res.status(201).json(category);
};

export const getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json(categories);
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const used = await Product.findOne({
    category: category.name,
  });

  if (used) {
    return res.status(400).json({
      message: "Category is used by products",
    });
  }

  await category.deleteOne();
  res.json({ message: "Category deleted" });
};
