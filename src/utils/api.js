import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import { getCookie } from "./getCookie";

export const postRequest = async (
  url,
  { data, headers = {}, errorMessage },
) => {
  const token = getCookie("authToken");
  try {
    const response = await axiosInstance.post(`/${url}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token && `Bearer ${token}`,
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(
      errorMessage || error?.response?.data?.message || "server Error",
    );
    Promise.reject(error);
  }
};

export const putRequest = async (url, data, headers = {}) => {
  try {
    const response = await axiosInstance.put(`/${url}`, data, {
      headers: { "Content-Type": "application/json", ...headers },
    });
    return response.data;
  } catch (error) {
    Promise.reject(error);
  }
};

export const getRequest = async (url, token = "") => {
  try {
    const response = await axiosInstance.get(`/${url}`, {
      headers: token ? { "access-token": token } : {},
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteRequest = async (url, token = "") => {
  try {
    const response = await axiosInstance.delete(`/${url}`, {
      headers: token ? { "access-token": token } : {},
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
