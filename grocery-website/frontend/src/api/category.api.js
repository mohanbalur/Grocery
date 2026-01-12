import API from "./api";
export const fetchCategories = () =>
    API.get("/categories");
  
  export const createCategory = (data) =>
    API.post("/categories", data);

  export const deleteCategory = (id) =>
    API.delete(`/categories/${id}`);