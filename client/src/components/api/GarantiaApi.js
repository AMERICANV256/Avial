import axios from "axios";

export const GarantiaAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}garantias`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
