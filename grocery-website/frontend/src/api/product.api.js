import API from "./api";

export const addProduct = (data) => API.post("/products", data);
export const fetchProducts = () => API.get("/products");
export const fetchProductsByCategory = (categoryId) =>
  API.get(`/products?category=${categoryId}`);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);

