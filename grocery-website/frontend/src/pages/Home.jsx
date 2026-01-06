import { useEffect, useState } from "react";
import { fetchProducts } from "../api/product.api.js";
import { fetchCategories } from "../api/category.api.js";
import { addToCart } from "../api/cart.api.js";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // 🔑 hamburger toggle
  const [showCategories, setShowCategories] = useState(false);

  const [showCartBar, setShowCartBar] = useState(false);
  const [cartSummary, setCartSummary] = useState({
    count: 0,
    total: 0,
  });

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const res = await fetchProducts();
    setProducts(res.data);

    const qty = {};
    res.data.forEach((p) => (qty[p._id] = 1));
    setQuantities(qty);
  };

  const loadCategories = async () => {
    const res = await fetchCategories();
    setCategories(res.data);
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      !selectedCategory || p.category?._id === selectedCategory;

    return matchSearch && matchCategory;
  });

  const increaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };
  
  const decreaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };
  
  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  
    const qty = quantities[product._id] || 1;
  
    // ✅ SHOW STICKY CART (optimistic UI)
    setCartSummary((prev) => ({
      count: prev.count + qty,
      total: prev.total + product.price * qty,
    }));
    setShowCartBar(true);
  
    try {
      // backend supports +1 only → loop
      for (let i = 0; i < qty; i++) {
        await addToCart(product._id);
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };
  

  return (
    <div className="page home-page">
      <div className={`home-layout ${showCategories ? "with-sidebar" : ""}`}>
        
        {/* LEFT SIDEBAR */}
        {showCategories && (
          <aside className="category-sidebar">
            <h4>Categories</h4>
  
            <div
              className={!selectedCategory ? "active" : ""}
              onClick={() => setSelectedCategory(null)}
            >
              All Products
            </div>
  
            {categories.map((cat) => (
              <div
                key={cat._id}
                className={selectedCategory === cat._id ? "active" : ""}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.name}
              </div>
            ))}
          </aside>
        )}
  
        {/* MAIN CONTENT */}
        <main className="home-main">
          {/* HERO / BANNER (UI ONLY) */}
          <section className="home-hero" aria-label="Welcome banner">
            <div className="hero-overlay" />
            <div className="hero-content">
              <p className="hero-eyebrow">Fresh • Fast • Eco-friendly</p>
              <h1 className="hero-title">Groceries delivered to your door</h1>
              <p className="hero-subtitle">
                Discover fresh fruits, vegetables, pantry essentials, and daily needs —
                curated for quality and delivered quickly.
              </p>
              <div className="hero-actions">
                <a className="hero-cta" href="#products">Shop products</a>
                <button
                  type="button"
                  className="hero-secondary"
                  onClick={() => setShowCategories(true)}
                >
                  Browse categories
                </button>
              </div>
            </div>

            <div className="hero-stats" aria-label="Store highlights">
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat">
                <span className="stat-number">Fresh</span>
                <span className="stat-label">Daily stock</span>
              </div>
              <div className="stat">
                <span className="stat-number">Fast</span>
                <span className="stat-label">Delivery</span>
              </div>
            </div>
          </section>
          
          {/* HEADER ROW */}
          <div className="home-header">
            <button
              className="hamburger-btn"
              onClick={() => setShowCategories((p) => !p)}
            >
              ☰
            </button>
  
            <h2 className="home-title">Products</h2>
          </div>
  
          {/* SEARCH */}
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
  
          {/* PRODUCTS GRID */}
          <div id="products" className="products-grid">
            {filteredProducts.map((p) => (
              <div key={p._id} className="product-banner">
              <div className="banner-image">
                <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                />
              </div>
 
  
                <div className="banner-content">
                  <h3>{p.name}</h3>
                  <p className="product-price">₹{p.price} / {p.quantityValue} {p.quantityUnit}</p>
                  <div className="qty-cart-row">
                    <div className="qty-controller">
                        <button onClick={() => decreaseQty(p._id)}>−</button>
                        <span>{quantities[p._id] || 1}</span>
                        <button onClick={() => increaseQty(p._id)}>+</button>
                    </div>

                    <button
                      className="add-btn full"
                      onClick={() => handleAddToCart(p)}
                    >
                      Add
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
  
      {/* STICKY CART BAR */}
      {showCartBar && (
        <div className="cart-toast">
          <span>
            <strong>{cartSummary.count} item(s)</strong> | ₹
            {cartSummary.total.toFixed(2)}
          </span>
  
          <button
            className="view-cart-btn"
            onClick={() => navigate("/cart")}
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
};
  

export default Home;
