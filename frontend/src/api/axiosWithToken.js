import axios from "axios";
import authConstants from "@store/constants/authConstants";
import { store } from "@store";

// // create axios instance have token
export const createAxiosWithToken = (baseURL, defaultHeaders = {}) => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: defaultHeaders,
  });

  // add token to request
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // handle timeout token
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response?.status === 401 &&
        error.response?.data?.error === "Token expired"
      ) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        localStorage.removeItem("empInfo");
        localStorage.removeItem("username");
        store.dispatch({ type: authConstants.LOGOUT });
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
