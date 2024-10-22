import { useMutation, useQuery } from "@tanstack/react-query";
import { ContactoAPI } from "../components/api/ContactoApi";
import Swal from "sweetalert2";

const getContacto = async () => {
  const { data } = await ContactoAPI.get("/get");
  return data;
};

const getContactoById = async (id) => {
  const { data } = await ContactoAPI.get(`/detalle/${id}`);
  return data;
};

const postContacto = async (data) => {
  return await ContactoAPI.post(`create`, data);
};

const editContacto = async (data) => {
  return await ContactoAPI.put(`derivado`, data);
};

export const useContacto = (id) => {
  const contactoQuery = useQuery({
    queryKey: ["contactos"],
    queryFn: () => getContacto(),
  });

  const contactoQueryById = useQuery({
    queryKey: ["contactoDetail", { contactoId: id }],
    queryFn: () => getContactoById(id),
    enabled: id !== undefined && id !== null,
  });

  const contactoMutation = useMutation({
    mutationKey: ["create-contacto"],
    mutationFn: (data) => postContacto(data),
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

  const contactoEditMutation = useMutation({
    mutationKey: ["edit-Contacto"],
    mutationFn: (data) => editContacto(data),
    onSuccess: () => {
      contactoQuery.refetch();
      Swal.fire({
        position: "center",
        icon: "info",
        title: "El contacto ha sido derivado corréctamente",
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
              title: "No se ha podido derivar el contacto. Intente más tarde",
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
    contactoQuery,
    contactoQueryById,
    contactoMutation,
    contactoEditMutation,
  };
};
