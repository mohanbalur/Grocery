import { useEffect, useState } from "react";
import { fetchAllOrders } from "../../api/order.api.js";
import { fetchProducts } from "../../api/product.api.js";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const ordersRes = await fetchAllOrders();
      setOrders(ordersRes.data || []);
  
      const productsRes = await fetchProducts();
      console.log("Products from dashboard:", productsRes.data);

        if (productsRes && Array.isArray(productsRes.data)) {
          setProductsCount(productsRes.data.length);
        } else {
          setProductsCount(0);
        }

    } catch (err) {
      console.error("Dashboard load failed", err);
    }
  };
  

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="admin-container">
      <h2 className="admin-title">Dashboard</h2>

      {/* ===== STATS ===== */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <p>Total Orders</p>
          <h3>{orders.length}</h3>
        </div>

        <div className="stat-card">
          <p>Total Revenue</p>
          <h3>₹{totalRevenue}</h3>
        </div>

        <div className="stat-card">
          <p>Total Products</p>
          <h3>{productsCount}</h3>
        </div>
      </div>

      {/* ===== RECENT ORDERS ===== */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Orders</h3>
          <button
            className="link-btn"
            onClick={() => navigate("/admin/orders")}
          >
            View All
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <div className="recent-orders">
            {recentOrders.map((order) => (
              <div key={order._id} className="order-row">
                <div>
                  <strong>{order.user?.name || "User"}</strong>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="order-amount">
                  ₹{order.totalAmount}
                </span>

                <span
                  className={`status-badge ${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;