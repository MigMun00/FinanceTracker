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

export async function refresh() {
  const res = await api.post("/auth/refresh");
  return res.data;
}

export async function logout() {
  const res = await api.post("/auth/logout");
  return res.data;
}
