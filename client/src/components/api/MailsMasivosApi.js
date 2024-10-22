import axios from "axios";

export const MailsMasivosAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}mailsMasivos`,
  headers: {
    "Content-type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});
