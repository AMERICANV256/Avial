import axios from "axios";

export const CotizacionIndividualAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}CotizacionIndividual`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
