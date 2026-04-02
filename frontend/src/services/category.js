import api from "./api";

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

export const createCategory = async (categoryData) => {
  const res = await api.post("/categories", categoryData);
  return res.data;
};

export const updateCategory = async (categoryId, categoryData) => {
  const res = await api.put(`/categories/${categoryId}`, categoryData);
  return res.data;
};

export const deleteCategory = async (categoryId) => {
  const res = await api.delete(`/categories/${categoryId}`);
  return res.data;
};
