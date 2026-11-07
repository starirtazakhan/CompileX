import axios from "axios";
   const api = axios.create({
     baseURL: "http://localhost:5000/api",
     timeout: 10000,
     headers: { "Content-Type": "application/json" }
   });

// Automatically attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("compilex_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;