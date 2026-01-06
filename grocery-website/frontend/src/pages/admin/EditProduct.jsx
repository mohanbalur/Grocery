import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts, updateProduct } from "../../api/product.api.js";
import { fetchCategories } from "../../api/category.api.js";

import "./admin.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);
  

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    quantityValue: "",
    quantityUnit: "kg",
  });

  const [currentImage, setCurrentImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    const res = await fetchProducts();
    const product = res.data.find((p) => p._id === id);

    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        category: product.category?._id || "",
        quantityValue: product.quantityValue,
        quantityUnit: product.quantityUnit,
      });

      // existing image (if backend already stores it)
      if (product.image) {
        setCurrentImage(product.image);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ⚠️ For now only text update (image backend comes next)
    await updateProduct(id, form);

    alert("Product updated");
    navigate("/admin/products");
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Edit Product</h2>

      <div className="edit-product-wrapper">
        <form onSubmit={handleSubmit} className="admin-card edit-product-card">

          {/* IMAGE SECTION */}
          <div className="edit-image-section">
            <label className="form-label">Product Image</label>

            {preview ? (
              < img src={preview} className="image-preview" />
            ) : currentImage ? (
              <img src={currentImage} className="image-preview" />
            ) : (
              <div className="image-placeholder">No Image</div>
            )}

            <label className="image-upload">
              Change Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* FORM FIELDS */}
          <label className="form-label">Product Name</label>
          <input
            placeholder="Enter product name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <label className="form-label">Price</label>
          <input
            type="number"
            placeholder="Enter price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            required
          />

          <div className="quantity-row">
            <input
              type="number"
              value={form.quantityValue}
              onChange={(e) =>
                setForm({ ...form, quantityValue: e.target.value })
              }
              required
            />

            <select
              value={form.quantityUnit}
              onChange={(e) =>
                setForm({ ...form, quantityUnit: e.target.value })
              }
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="piece">piece</option>
              <option value="ml">ml</option>
              <option value="l">l</option>
            </select>
          </div>


          <label className="form-label">Category</label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>


          <button className="btn edit update-btn">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
