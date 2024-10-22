import axios from "axios";

export const ClientesAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}clientes`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
