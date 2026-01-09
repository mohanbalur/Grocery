import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});


export const addProduct = (data) => API.post("/products", data);
export const fetchProducts = () => API.get("/products");
export const fetchProductsByCategory = (categoryId) =>
  API.get(`/products?category=${categoryId}`);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);

