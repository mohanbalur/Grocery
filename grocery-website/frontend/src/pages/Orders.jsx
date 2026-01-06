import { useEffect, useState } from "react";
import { fetchMyOrders } from "../api/order.api.js";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetchMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <p className="page-container">Loading orders...</p>;
  }

  return (
    <div className="page-container orders-page">
      <h2 className="orders-title">📦 My Orders</h2>

      {orders.length === 0 ? (
        <p className="empty-orders">No orders yet</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">
                  Order #{order._id.slice(-6)}
                </span>
                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-details">
                <p>
                  <strong>Total:</strong> ₹{order.totalAmount}
                </p>

                <p>
                  <strong>Items:</strong>{" "}
                  {
                    order.items.filter((item) => item.product).length
                  }
                </p>
              </div>

              {/* ✅ SHOW ITEMS (deleted products removed) */}
              <div className="order-items">
                {order.items
                  .filter((item) => item.product)
                  .map((item) => (
                    <p key={item._id}>
                      {item.product.name} × {item.quantity}
                    </p>
                  ))}
              </div>

              <p className="order-date">
                Ordered on{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
