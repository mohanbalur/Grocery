import API from "./api";
export const fetchMyProfile = async () => {
    console.log("➡️ fetchMyProfile called");
  return API.get("/users/profile");
};

export const updateMyProfile = (data) =>{
  return API.put("/users/profile", data);
};