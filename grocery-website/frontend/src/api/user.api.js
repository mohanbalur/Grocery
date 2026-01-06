import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
  });
  
  API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  });

export const fetchMyProfile = async () => {
    console.log("➡️ fetchMyProfile called");
  return API.get("/users/profile");
};

export const updateMyProfile = (data) =>{
  return API.put("/users/profile", data);
};