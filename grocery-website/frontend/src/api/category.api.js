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

export const fetchCategories = () =>
    API.get("/categories");
  
  export const createCategory = (data) =>
    API.post("/categories", data);

  export const deleteCategory = (id) =>
    API.delete(`/categories/${id}`);