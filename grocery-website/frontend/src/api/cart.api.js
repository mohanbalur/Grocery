import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token"); // ✅ FIX

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const fetchCart = () => API.get("/cart");

export const addToCart = (productId) =>
  API.post(`/cart/${productId}`);

export const removeFromCart = (productId) =>
  API.delete(`/cart/${productId}`);
