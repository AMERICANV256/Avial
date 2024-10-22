import { useMutation, useQuery } from "@tanstack/react-query";
import { RepuestosAPI } from "../components/api/RepuestosAPI";
import Swal from "sweetalert2";

const getRepuestos = async () => {
  const { data } = await RepuestosAPI.get("/get");
  return data;
};

const getRepuestoById = async (id) => {
  const { data } = await RepuestosAPI.get(`/detalle/${id}`);
  return data;
};

const postRepuesto = async (data) => {
  return await RepuestosAPI.post(`create`, data);
};

const editRepuesto = async (data) => {
  return await RepuestosAPI.put(`derivado`, data);
};

export const useRepuesto = (id) => {
  const repuestoQuery = useQuery({
    queryKey: ["repuestos"],
    queryFn: () => getRepuestos(),
  });

  const repuestoQueryById = useQuery({
    queryKey: ["repuestoDetail", { repuestoId: id }],
    queryFn: () => getRepuestoById(id),
    enabled: id !== undefined && id !== null,
  });

  const repuestoMutation = useMutation({
    mutationKey: ["create-repuesto"],
    mutationFn: (data) => postRepuesto(data),
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

  const repuestoEditMutation = useMutation({
    mutationKey: ["edit-Contacto"],
    mutationFn: (data) => editRepuesto(data),
    onSuccess: () => {
      repuestoQuery.refetch();
      Swal.fire({
        position: "center",
        icon: "info",
        title: "El repuesto ha sido derivado corréctamente",
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
              title: "No se ha podido derivar el Repuesto. Intente más tarde",
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
    repuestoQuery,
    repuestoQueryById,
    repuestoMutation,
    repuestoEditMutation,
  };
};
