import axios from "axios";

export const RepuestosAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}repuestos`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
