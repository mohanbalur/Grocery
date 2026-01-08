import { useEffect, useState } from "react";
import { fetchProducts } from "../api/product.api.js";
import { fetchCategories } from "../api/category.api.js";
import {
  fetchCart,
  addToCart,
  removeFromCart,
} from "../api/cart.api.js";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ✅ REQUIRED cart state (same as Cart.jsx)
  const [cart, setCart] = useState({ items: [] });

  const [showCategories, setShowCategories] = useState(false);
  const [showCartBar, setShowCartBar] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadCart();
  }, []);

  /* =========================
     LOADERS
  ========================= */
  const loadProducts = async () => {
    const res = await fetchProducts();
    setProducts(res.data || []);
  };

  const loadCategories = async () => {
    const res = await fetchCategories();
    setCategories(res.data || []);
  };

  const loadCart = async () => {
    try {
      const res = await fetchCart();
      setCart(res.data || { items: [] });
      setShowCartBar(res.data?.items?.length > 0);
    } catch {
      setCart({ items: [] });
      setShowCartBar(false);
    }
  };

  /* =========================
     FILTERING
  ========================= */
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      !selectedCategory || p.category?._id === selectedCategory;

    return matchSearch && matchCategory;
  });

  /* =========================
     CART HELPERS (same logic as Cart.jsx)
  ========================= */
  const getCartQty = (productId) => {
    const item = cart?.items?.find(
      (i) => i?.product?._id === productId
    );
    return item ? item.quantity : 0;
  };

  const increaseQty = async (productId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    await addToCart(productId);
    loadCart();
  };

  const decreaseQty = async (productId) => {
    await removeFromCart(productId);
    loadCart();
  };

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    await addToCart(product._id);
    loadCart();
  };

  /* =========================
     SAFE CART TOTALS
  ========================= */
  const safeCartItems = Array.isArray(cart?.items)
    ? cart.items.filter(
        (item) => item && item.product && item.quantity > 0
      )
    : [];

  const cartCount = safeCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = safeCartItems.reduce(
    (sum, item) =>
      sum + item.quantity * item.product.price,
    0
  );

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="page home-page">
      <div className="home-layout">
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
                className={
                  selectedCategory === cat._id ? "active" : ""
                }
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.name}
              </div>
            ))}
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="home-main">
          <div className="home-header">
            <button
              className="hamburger-btn"
              onClick={() => setShowCategories((p) => !p)}
            >
              ☰
            </button>
            <h2 className="home-title">Products</h2>
          </div>

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
          <div className="products-grid">
            {filteredProducts.map((p) => {
              const qty = getCartQty(p._id);

              return (
                <div key={p._id} className="product-banner">
                  <div className="banner-image">
                    <img src={p.image} alt={p.name} />
                  </div>

                  <div className="banner-content">
                    <h3>{p.name}</h3>
                    <p className="product-price">
                      ₹{p.price} / {p.quantityValue}{" "}
                      {p.quantityUnit}
                    </p>

                    <div className="qty-cart-row">
                      {qty > 0 ? (
                        <div className="qty-controller">
                          <button
                            onClick={() =>
                              decreaseQty(p._id)
                            }
                          >
                            −
                          </button>
                          <span>{qty}</span>
                          <button
                            onClick={() =>
                              increaseQty(p._id)
                            }
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="add-btn full"
                          onClick={() =>
                            handleAddToCart(p)
                          }
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* STICKY CART */}
      {showCartBar && cartCount > 0 && (
        <div className="cart-toast">
          <span>
            <strong>{cartCount} item(s)</strong> | ₹
            {cartTotal.toFixed(2)}
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
