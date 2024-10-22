import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CotizacionIndividualAPI } from "../components/api/CotizacionIndividualApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const getCountCotizacionEstado3 = async () => {
  const response = await CotizacionIndividualAPI.get("getEstado3");
  return response.data;
};

const postCotizacionState2 = async (data) => {
  return await CotizacionIndividualAPI.put(`estado2`, { id: data.id });
};

const postCotizacionState3 = async (data) => {
  return await CotizacionIndividualAPI.put(`estado3`, { id: data.id });
};

export const useCotizacionIndividual = () => {
  const navigate = useNavigate();

  const countEstado3 = useQuery({
    queryKey: ["countEstado3"],
    queryFn: () => getCountCotizacionEstado3(),
  });

  const cotizacionMutationState2 = useMutation({
    mutationKey: ["cotizacionIndividualState2-mutation"],
    mutationFn: (data) => postCotizacionState2(data),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Venta Aprobada",
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
              icon: "info",
              title: "No se pudo concretar la venta. Intente más tarde",
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
        }
      }
    },
  });

  const cotizacionMutationState3 = useMutation({
    mutationKey: ["cotizacionIndividualState3-mutation"],
    mutationFn: (data) => postCotizacionState3(data),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Venta Pendiente de Aprobación",
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
              icon: "info",
              title: "No se pudo Aprobar la venta. Intente más tarde",
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
        }
      }
    },
  });

  return {
    cotizacionMutationState2,
    cotizacionMutationState3,
    countEstado3,
  };
};
