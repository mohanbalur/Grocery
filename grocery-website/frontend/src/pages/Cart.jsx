import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  addToCart,
  removeFromCart,
} from "../api/cart.api.js";
import { placeOrder } from "../api/order.api.js";
import DeliveryForm from "../components/DeliveryForm";
import "./Cart.css";

const Cart = () => {
  // ✅ SAFE INITIAL STATE (prevents null crash)
  const [cart, setCart] = useState({ items: [] });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // 🆕 DELIVERY FLOW
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔄 LOAD CART
  const loadCart = async () => {
    try {
      const res = await fetchCart();
      setCart(res.data || { items: [] });
    } catch (err) {
      console.error("Failed to load cart", err);
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ➕ INCREASE QTY
  const increaseQty = async (productId) => {
    await addToCart(productId);
    loadCart();
  };

  // ➖ DECREASE QTY
  const decreaseQty = async (productId) => {
    await removeFromCart(productId);
    loadCart();
  };

  // 🧪 PAYMENT SIMULATION (UNCHANGED LOGIC)
  const simulateOnlinePayment = () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() < 0.9 ? resolve() : reject();
      }, 1500);
    });

  // ✅ STEP 1: OPEN DELIVERY FORM
  const handlePlaceOrder = () => {
    setShowDeliveryForm(true);
  };

  // ✅ STEP 2: AFTER DELIVERY DETAILS
  const handleDeliverySubmit = async (details) => {
    setDeliveryDetails(details);
    setShowDeliveryForm(false);
    await handleCheckout(details);
  };

  // ✅ STEP 3: PAYMENT + ORDER
  const handleCheckout = async (delivery) => {
    try {
      setLoading(true);

      if (paymentMethod === "ONLINE") {
        await simulateOnlinePayment();
      }

      await placeOrder({
        deliveryDetails: delivery,
        paymentMethod,
      });

      alert(
        paymentMethod === "COD"
          ? "Order placed successfully (Cash on Delivery)"
          : "Payment successful! Order placed 🎉"
      );

      navigate("/orders");
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAFE ITEM FILTERING
  const validItems = Array.isArray(cart?.items)
    ? cart.items.filter(
        (item) => item.product && item.quantity > 0
      )
    : [];

  // ✅ TOTAL CALCULATION
  const totalAmount = validItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <div className="page-container cart-page">
      <h2 className="cart-title">🛒 My Cart</h2>

      {validItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Return to Purchase
          </button>
        </div>
      ) : (
        <>
          {/* CART ITEMS */}
          <div className="cart-items">
            {validItems.map((item) => (
              <div key={item._id} className="cart-card">
                <div className="cart-info">
                  <h4>{item.product.name}</h4>

                  <div className="qty-control">
                    <button
                      onClick={() =>
                        decreaseQty(item.product._id)
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        increaseQty(item.product._id)
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="subtotal">
                    ₹{item.product.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="cart-summary">
            <div className="summary-row">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>

            {/* PAYMENT METHOD */}
            <div className="payment-section">
              <h4>Payment Method</h4>

              <label>
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>

              <label>
                <input
                  type="radio"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
                Online Payment (Simulation)
              </label>
            </div>

            {/* ACTIONS */}
            <div className="cart-actions">
              <button
                className="btn-secondary"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Return to Purchase
              </button>

              <button
                className="btn-primary"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 🆕 DELIVERY FORM MODAL */}
      {showDeliveryForm && (
        <DeliveryForm
          onSubmit={handleDeliverySubmit}
          onClose={() => setShowDeliveryForm(false)}
        />
      )}
    </div>
  );
};

export default Cart;
