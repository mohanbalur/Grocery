import API from "./api";

export const fetchCart = () => API.get("/cart");

export const addToCart = (productId) =>
  API.post(`/cart/${productId}`);

export const removeFromCart = (productId) =>
  API.delete(`/cart/${productId}`);
