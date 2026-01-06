import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductsByCategory } from "../api/product.api"; 
// ✅ REQUIRED


const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProductsByCategory(categoryId)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, [categoryId]);

  return (
    <div className="page-container">
      <h2>Products</h2>

      {products.length === 0 ? (
        <p className="empty-text">No products in this category</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div key={p._id} className="product-card">
              <h4>{p.name}</h4>
              <p className="price">₹{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
