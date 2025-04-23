// src/util/apiService.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://forgeprep.net/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 👈 sends the secure cookie
});

// 🧼 Remove the token check — it's unused now
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // localStorage.removeItem("token"); // Optional now, unless other local auth data is stored
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
