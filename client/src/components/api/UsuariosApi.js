import axios from "axios";

export const UsuariosAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}usuarios`,
  // withCredentials: true,
  // mode: "cors",
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
