import api from "./api";

export const getUser = async (token) => {
  const res = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
