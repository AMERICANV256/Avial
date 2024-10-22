import axios from "axios";

export const HistorialAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}historial`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
