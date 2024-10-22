import axios from "axios";

export const ProductosAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}productos`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
