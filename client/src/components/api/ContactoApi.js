import axios from "axios";

export const ContactoAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}contacto`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
