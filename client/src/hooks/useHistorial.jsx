import { useMutation, useQuery } from "@tanstack/react-query";
import { HistorialAPI } from "../components/api/HistorialApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const postHistorialVendedor = async (data) => {
  return await HistorialAPI.post(`/vendedor`, data);
};
const postHistorialModelo = async (data) => {
  return await HistorialAPI.post(`/modelo`, data);
};

export const useHistorial = () => {
  const navigate = useNavigate();

  const historialVendedorMutation = useMutation({
    mutationKey: ["historialVendedor-mutation"],
    mutationFn: (data) => postHistorialVendedor(data),
    onError: (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            Swal.fire({
              position: "center",
              icon: "warning",
              title:
                "No se encontraron cotizaciones para los valores ingresados",
              background: "#ffffff",
              iconColor: "#ffc107",
              customClass: {
                title: "text-dark",
              },
              showConfirmButton: false,
              timer: 5000,
            });
            break;
          case 401:
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "Tu sesión ha expirado",
              showConfirmButton: false,
              timer: 2000,
              background: "#ffffff",
              iconColor: "#ffc107",
              customClass: {
                title: "text-dark",
              },
            }).then(() => {
              navigate("/");
            });
            break;
          default:
            Swal.fire({
              position: "center",
              icon: "warning",
              title:
                "No se encontraron cotizaciones para los valores ingresados",
              showConfirmButton: false,
              timer: 2000,
              background: "#ffffff",
              iconColor: "#ffc107",
              customClass: {
                title: "text-dark",
              },
            });
            break;
        }
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Hubo un error al procesar la solicitud",
          showConfirmButton: false,
          timer: 2000,
          background: "#ffffff",
          iconColor: "#ffc107",
          customClass: {
            title: "text-dark",
          },
        });
      }
    },
  });

  const historialModeloMutation = useMutation({
    mutationKey: ["historialModelo-mutation"],
    mutationFn: (data) => postHistorialModelo(data),
    onError: (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            Swal.fire({
              position: "center",
              icon: "warning",
              title:
                "No se encontraron cotizaciones para los valores ingresados",
              background: "#ffffff",
              iconColor: "#ffc107",
              customClass: {
                title: "text-dark",
              },
              showConfirmButton: false,
              timer: 5000,
            });
            break;
          case 401:
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "Tu sesión ha expirado",
              showConfirmButton: false,
              timer: 2000,
              background: "#ffffff",
              iconColor: "#ffc107",
              customClass: {
                title: "text-dark",
              },
            }).then(() => {
              navigate("/");
            });
            break;
          default:
            Swal.fire({
              position: "center",
              icon: "warning",
              title:
                "No se encontraron cotizaciones para los valores ingresados",
              showConfirmButton: false,
              timer: 2000,
              background: "#ffffff",
              iconColor: "#ffc107",
              customClass: {
                title: "text-dark",
              },
            });
            break;
        }
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Hubo un error al procesar la solicitud",
          showConfirmButton: false,
          timer: 2000,
          background: "#ffffff",
          iconColor: "#ffc107",
          customClass: {
            title: "text-dark",
          },
        });
      }
    },
  });
  return {
    historialVendedorMutation,
    historialModeloMutation,
  };
};
