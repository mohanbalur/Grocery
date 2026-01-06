import { useEffect, useState } from "react";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../api/order.api.js";
import "./admin.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const res = await fetchAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Manage Orders</h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((order) => (
        <div key={order._id} className="admin-card">
          <p>
            <strong>User:</strong> {order.user?.name || "Unknown"}
          </p>

          <p>
            <strong>Total:</strong> ₹{order.totalAmount}
          </p>

          <p>
            <strong>Payment:</strong>{" "}
            {order.paymentMethod === "ONLINE" ? (
              <span className="badge badge-paid">PAID</span>
            ) : (
              <span className="badge badge-cod">COD</span>
            )}
          </p>

          <p>
            <strong>Order Status:</strong>{" "}
            <span className="badge badge-pending">
              {order.status}
            </span>
          </p>

          {/* ITEMS (deleted products removed) */}
          <div className="admin-items">
            <strong>Items:</strong>
            {order.items
              .filter((item) => item.product) // remove deleted products
              .map((item) => (
                <p key={item._id}>
                  {item.product.name} × {item.quantity}
                </p>
              ))}
          </div>

          {/* STATUS UPDATE */}
          <select
            value={order.status}
            onChange={(e) =>
              handleStatusChange(order._id, e.target.value)
            }
          >
            <option value="Placed">Placed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
