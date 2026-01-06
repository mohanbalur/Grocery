import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCart } from "../api/cart.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileDropdown from "./ProfileDropdown";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [cartCount, setCartCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // 🔄 load cart count for logged-in users
  useEffect(() => {
    if (user && user.role === "user") {
      fetchCart()
        .then((res) => {
          const items = res.data.items || [];
          const totalQty = items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          setCartCount(totalQty);
        })
        .catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-modern">
        {/* LEFT: BRAND */}
        <div className="nav-brand" onClick={() => navigate("/")}>
          🛒 <span>Grocery</span>
        </div>

        {/* RIGHT: LINKS */}
        <div className="nav-actions">
          <Link to="/" className="nav-link">Home</Link>

          {/* USER NAV */}
          {user && user.role === "user" && (
            <>
              <Link to="/cart" className="cart-icon">
                🛒
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>

              {/* PROFILE DROPDOWN (USER ONLY) */}
              <div className="profile-wrapper">
                <button
                  className="profile-btn"
                  onClick={() => setShowProfileMenu((p) => !p)}
                >
                  👤 ▾
                </button>

                {showProfileMenu && (
                  <ProfileDropdown
                    onClose={() => setShowProfileMenu(false)}
                  />
                )}
              </div>
            </>
          )}

          {/* ADMIN NAV */}
          {user && user.role === "admin" && (
            <>
              <Link to="/admin/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/admin/orders" className="nav-link">
                Orders
              </Link>

              {/* ✅ ADMIN LOGOUT (FIX) */}
              <button
                className="btn-pill danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          {/* AUTH BUTTONS (GUEST) */}
          {!user && (
            <>
              <Link to="/login" className="btn-pill primary">Login</Link>
              <Link to="/register" className="btn-pill outline">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
