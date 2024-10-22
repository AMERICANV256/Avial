import axios from "axios";

export const mensajesAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}mensajes`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
