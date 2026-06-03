import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080') + "/api/products";

// lấy token từ localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getProductsAPI = () => {
  return axios.get(API_URL, getAuthHeader());
};

export const createProductAPI = (data: any) => {
  return axios.post(API_URL, data, getAuthHeader());
};

export const updateProductAPI = (id: number, data: any) => {
  return axios.put(`${API_URL}/${id}`, data, getAuthHeader());
};

export const deleteProductAPI = (id: number) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};