import { useMutation, useQuery } from "@tanstack/react-query";
import { GarantiaAPI } from "../components/api/GarantiaApi";
import Swal from "sweetalert2";

const getGarantia = async () => {
  const { data } = await GarantiaAPI.get("/getAll");
  return data;
};

const getGarantiaById = async (id) => {
  const { data } = await GarantiaAPI.get(`/garantiasById/${id}`);
  return data;
};

const postGarantia = async (data) => {
  return await GarantiaAPI.post(`create`, data);
};

const editGarantia = async (data) => {
  return await GarantiaAPI.put(`derivado`, data);
};

export const useGarantia = (id) => {
  const GarantiaQuery = useQuery({
    queryKey: ["garantias"],
    queryFn: () => getGarantia(),
  });

  const garantiaQueryById = useQuery({
    queryKey: ["garantia", { garantiaId: id }],
    queryFn: () => getGarantiaById(id),
    enabled: id !== undefined && id !== null,
  });

  const GarantiaMutation = useMutation({
    mutationKey: ["create-garantia"],
    mutationFn: (data) => postGarantia(data),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "info",
        title:
          "Gracias por contactactarte con Nosotros! A la brevedad te responderemos!",
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
              title:
                "Hay errores en el formulario; por favor, intente nuevamente",
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

  const garantiaEditMutation = useMutation({
    mutationKey: ["edit-garantia"],
    mutationFn: (data) => editGarantia(data),
    onSuccess: () => {
      GarantiaQuery.refetch();
      Swal.fire({
        position: "center",
        icon: "info",
        title: "La garantía ha sido derivado corréctamente",
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
              title: "No se ha podido derivar la Garantía. Intente más tarde",
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
    GarantiaQuery,
    garantiaQueryById,
    GarantiaMutation,
    garantiaEditMutation,
  };
};
