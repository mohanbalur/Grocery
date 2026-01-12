import API from "./api.js";

export const placeOrder = (data) => API.post("/orders",data);
export const fetchMyOrders = () => API.get("/orders/my");
export const fetchAllOrders = () => API.get("/orders");
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}`, { status });
