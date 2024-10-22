import axios from "axios";

export const OfertasNovedadesAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}ofertasNovedades`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
