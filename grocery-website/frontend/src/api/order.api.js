import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

/* ✅ Always read token from userInfo */
API.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo?.token) {
    req.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return req;
});

export const placeOrder = (data) => API.post("/orders",data);
export const fetchMyOrders = () => API.get("/orders/my");
export const fetchAllOrders = () => API.get("/orders");
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}`, { status });
