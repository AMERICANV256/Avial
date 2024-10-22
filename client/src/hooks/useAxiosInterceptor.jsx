// hooks/useAxiosInterceptor.js
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAxiosInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Interceptor para las solicitudes
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para las respuestas
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;

        if (response) {
          if (response.status === 401) {
            if (response.data && response.data.message === "token inválido") {
              console.log(response.data);
              console.log(response.data.message);

              localStorage.removeItem("token");
              navigate("/");
              return Promise.reject(error);
            }
          }
        }
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);
};

export default useAxiosInterceptor;
