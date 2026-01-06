import { useEffect, useState } from "react";
import { fetchProducts, deleteProduct } from "../../api/product.api.js";
import { useNavigate } from "react-router-dom";
import AddProduct from "./AddProduct";
import "./admin.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const loadProducts = async () => {
    const res = await fetchProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const handleProductAdded = () => {
    setShowAddForm(false);
    loadProducts();
  };

  return (
    <div className="admin-container">
      <div className="admin-header-row">
        <h2 className="admin-title">Manage Products</h2>

        <button
          className="add-fab"
          onClick={() => setShowAddForm(!showAddForm)}
          title="Add Product"
        >
          +
        </button>
      </div>

      {showAddForm && (
        <AddProduct onProductAdded={handleProductAdded} />
      )}

      <div className="admin-grid">
        {products.map((p) => (
          <div key={p._id} className="admin-card">
            <h3>{p.name}</h3>

            {/* ✅ PRICE + QUANTITY (NO LOGIC CHANGE) */}
            <p>
              ₹{p.price} / {p.quantityValue} {p.quantityUnit}
            </p>

            {/* ✅ CATEGORY OBJECT SAFE RENDER */}
            <p className="category">
              {p.category?.name || "Uncategorized"}
            </p>

            <div className="admin-actions">
              <button
                className="btn edit"
                onClick={() => navigate(`/admin/products/edit/${p._id}`)}
              >
                Edit
              </button>
              <button
                className="btn delete"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
