import { useMutation, useQuery } from "@tanstack/react-query";
import { SuscriptoresAPI } from "../components/api/SuscriptoresAPI";
import Swal from "sweetalert2";

const getSuscriptores = async () => {
  const { data } = await SuscriptoresAPI.get("/getAll");
  return data;
};

const postSuscriptores = async (data) => {
  return await SuscriptoresAPI.post(`create`, data);
};

export const useSuscriptores = () => {
  const suscripcionQuery = useQuery({
    queryKey: ["suscripcion"],
    queryFn: () => getSuscriptores(),
  });

  const suscripcionMutation = useMutation({
    mutationKey: ["create-suscripcion"],
    mutationFn: (data) => postSuscriptores(data),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "info",
        title:
          "Gracias por Suscribirte! Periódicamente te enviaremos las novedades y ofertas de AMERICAN VIAL!",
        showConfirmButton: false,
        timer: 2000,
        background: "#ffffff",
        iconColor: "#ffc107",
        customClass: {
          title: "text-dark",
        },
      });
    },
    onError: (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "El Email ingresado se encuentra suscripto",
              background: "#ffffff",
              iconColor: "#ffc107",
              customClass: {
                title: "text-dark",
              },
              showConfirmButton: false,
              timer: 5000,
            });
            break;
          default:
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "Hubo un error",
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
    suscripcionMutation,
    suscripcionQuery,
  };
};
