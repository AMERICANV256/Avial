import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OfertasNovedadesAPI } from "../components/api/OfertasNovedades.Api";
import Swal from "sweetalert2";

const getOfertasNovedades = async () => {
  const { data } = await OfertasNovedadesAPI.get("/get");
  return data;
};

const postOfertaNovedad = async (data) => {
  return await OfertasNovedadesAPI.post(`create`, data);
};

const editOfertaNovedades = async (data) => {
  return await OfertasNovedadesAPI.put(`edit`, data);
};

const deleteOfertasNovedad = async (data) => {
  return await OfertasNovedadesAPI.delete(`delete`, { data });
};

export const useOfertasNovedades = () => {
  const queryClient = useQueryClient();
  const ofertaNovedadQuery = useQuery({
    queryKey: ["ofertasNovedades"],
    queryFn: () => getOfertasNovedades(),
  });

  const ofertaNovedadMutation = useMutation({
    mutationKey: ["create-ofertaNovedad"],
    mutationFn: (data) => postOfertaNovedad(data),
    onSuccess: () => {
      queryClient.invalidateQueries("ofertasNovedades");
      Swal.fire({
        position: "center",
        icon: "info",
        title: "La oferta / Novedad ha sido creada con éxito",
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
              title: "No se pudo crear la oferta / novedad. Intente más tarde",
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

  const ofertaNovedadEditMutation = useMutation({
    mutationKey: ["edit-ofertaNovedad"],
    mutationFn: (data) => editOfertaNovedades(data),
    onSuccess: () => {
      queryClient.invalidateQueries("ofertasNovedades");
      Swal.fire({
        position: "center",
        icon: "info",
        title: "La oferta / novedad ha sido modificada con éxito",
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
                "No se pudo modificar la oferta / novedad. Intente más tarde",
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

  const ofertaNovedadDeleteMutation = useMutation({
    mutationKey: ["delete-ofertaNovedad"],
    mutationFn: (data) => deleteOfertasNovedad(data),
    onSuccess: () => {
      queryClient.invalidateQueries("ofertasNovedades");
      Swal.fire({
        position: "center",
        icon: "info",
        title: "La oferta / novedad ha sido eliminada con éxito",
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
                "No se pudo eliminar la oferta / novedad. Intente más tarde",
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
    ofertaNovedadMutation,
    ofertaNovedadQuery,
    ofertaNovedadEditMutation,
    ofertaNovedadDeleteMutation,
  };
};
