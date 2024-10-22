import axios from "axios";

export const SuscriptoresAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}suscripcion`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
