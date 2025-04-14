import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.method === "post") {
      if (response.status === 200) {
        toast.success(response?.data?.message || "Success");
      }
    }
    return response;
  },
  (error) => {
    const method = error?.config?.method;

    if (method !== "post") {
      if (error?.response?.status === 500) {
        toast.error(
          error?.response?.data?.message || "Something went wrong (500)",
        );
      } else if (error?.response?.status === 400) {
        toast.error(error?.response?.data?.message || "Bad Request");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
