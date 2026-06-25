import axios from "axios";

const RAW_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
const BASE = RAW_BASE.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("executorToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
