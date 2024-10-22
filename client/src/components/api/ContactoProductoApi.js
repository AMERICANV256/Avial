import axios from "axios";

export const ContactoProductoAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}contactoProducto`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
