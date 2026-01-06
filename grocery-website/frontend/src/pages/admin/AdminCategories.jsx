import { useEffect, useState } from "react";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from "../../api/category.api";

const AdminCategories = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW: toggle add category form
  const [showAdd, setShowAdd] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await fetchCategories();

      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.categories || [];

      setCategories(list);
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) return;

    await createCategory({ name });
    setName("");
    setShowAdd(false); // ✅ hide after add
    loadCategories();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="admin-container">
      {/* ✅ HEADER WITH + BUTTON */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2 className="admin-title">Manage Categories</h2>

        <button
          className="btn-primary"
          style={{ width: "44px", fontSize: "22px", padding: 0 }}
          onClick={() => setShowAdd(!showAdd)}
          title="Add Category"
        >
          +
        </button>
      </div>

      {/* ✅ ADD CATEGORY (TOGGLE) */}
      {showAdd && (
        <div className="category-add-card">
          <input
            className="category-input"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn-primary" onClick={handleAdd}>
            Add
          </button>
        </div>
      )}

      {/* CATEGORY LIST */}
      {loading ? (
        <p className="empty-text">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="empty-text">No categories found</p>
      ) : (
        <div className="category-list">
          {categories.map((cat) => (
            <div key={cat._id} className="category-item">
              <span className="category-name">{cat.name}</span>
              <button
                className="btn-delete"
                onClick={() => handleDelete(cat._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
