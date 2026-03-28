import api from "./api";

export async function login(data) {
  const formData = new URLSearchParams();

  formData.append("username", data.email);
  formData.append("password", data.password);

  const res = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return res.data;
}

export async function register(data) {
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function logout() {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const res = await api.post("/auth/logout", { refresh_token: refreshToken });
  return res.data;
}
