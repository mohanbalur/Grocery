import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

// PLACE ORDER
export const placeOrder = async (req, res) => {
  try {
    // ✅ SAFE BODY READ
    const { deliveryDetails, paymentMethod } = req.body || {};

    // ✅ DELIVERY VALIDATION (UNCHANGED)
    if (
      !deliveryDetails ||
      !deliveryDetails.name ||
      !deliveryDetails.phone ||
      !deliveryDetails.address
    ) {
      return res
        .status(400)
        .json({ message: "Delivery details are required" });
    }

    // ✅ LOAD CART (UNCHANGED)
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ FILTER VALID ITEMS (UNCHANGED)
    const validItems = cart.items.filter(
      (item) => item.product && item.product.price != null
    );

    if (validItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ TOTAL CALCULATION (UNCHANGED)
    const totalAmount = validItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    // 🔧 FIX (REQUIRED): MAP TO ORDER SCHEMA
    const orderItems = validItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    // ✅ CREATE ORDER (LOGIC UNCHANGED)
    const order = await Order.create({
      user: req.user._id,
      items: orderItems, // ✅ FIXED
      totalAmount,
      deliveryDetails,
      paymentMethod,
      paymentStatus:
        paymentMethod === "ONLINE" ? "Paid" : "Pending",
      status: "Placed",
    });

    // ✅ CLEAR CART (UNCHANGED)
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Order placement failed:", error);
    res.status(500).json({ message: "Order placement failed" });
  }
};

// USER: Order history
export const getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product");
  res.json(orders);
};

// ADMIN: All orders
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user")
    .populate("items.product");
  res.json(orders);
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(order);
};
