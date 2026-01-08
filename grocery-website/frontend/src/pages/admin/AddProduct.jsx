import { useEffect, useState } from "react";
import { addProduct } from "../../api/product.api.js";
import { fetchCategories } from "../../api/category.api.js";
import "./admin.css";

const AddProduct = ({ onProductAdded }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    quantityValue: "",
    quantityUnit: "kg",
  });

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // fetch categories once
  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("quantityValue", form.quantityValue);
      formData.append("quantityUnit", form.quantityUnit);

      if (image) {
        formData.append("image", image);
      }

      await addProduct(formData);

      alert("Product added");
      setForm({
        name: "",
        price: "",
        category: "",
        quantityValue: "",
        quantityUnit: "kg",
      });
      setImage(null);
      setPreview(null);
      onProductAdded?.();
    } catch (err) {
      alert(err.response?.data?.message || "Add product failed");
    }
  };

  return (
    <div className="add-product-wrapper">
      <form onSubmit={handlesubmit} className="add-product-card">
        <h3>Add Product</h3>

        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          required
        />

        <div className="quantity-row">
          <input
            type="number"
            placeholder="Quantity"
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

        {/* Category */}
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

        {/* Image Upload */}
        <div className="image-section"></div>
          <label className="image-upload">
            Click to upload product image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>

          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
        

        {/* BUTTON WRAPPER FOR CENTERING */}
        <div className="add-product-btn-wrapper">
          <button className="add-product-btn">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
