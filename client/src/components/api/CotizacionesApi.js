import axios from "axios";

export const CotizacionesAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}cotizaciones`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
