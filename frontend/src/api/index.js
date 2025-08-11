import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5000/Login",
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn token
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi token hết hạn
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorMsg = error.response?.data?.error;

    if (status === 401 && errorMsg === "Token expired") {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

const loginRequest = (credentials) => {
  return authApi.post("/login", credentials);
};

export { loginRequest };
