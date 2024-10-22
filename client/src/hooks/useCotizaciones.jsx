import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CotizacionesAPI } from "../components/api/CotizacionesApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const getVentaById = async (idUsuario) => {
  const { data } = await CotizacionesAPI.get(`/getVentas/${idUsuario}`);
  return data;
};

const getVentasDetalleById = async (id) => {
  const { data } = await CotizacionesAPI.get(`/getVentasById/${id}`);
  return data;
};

const postCotizacion = async (data) => {
  return await CotizacionesAPI.post(`create`, data);
};

const postEnvioCotizacionPorEmial = async (data) => {
  return await CotizacionesAPI.post(`/enviocoti/create`, data);
};

const postCotisPorFecha = async (data) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token no proporcionado");
  }

  return await CotizacionesAPI.post("/fecha/", data, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const getCotizacionParaSerAprobada = async () => {
  const { data } = await CotizacionesAPI.get(`/getCotizacionEstado3`);
  return data;
};

const postCotizacionState2 = async (data) => {
  return await CotizacionesAPI.put(`state`, { id: data.id });
};

const editCotizacion = async (data) => {
  return await CotizacionesAPI.put(`edit`, data);
};

const editCotizacionPDF = async (data) => {
  return await CotizacionesAPI.put(`editpdf`, data);
};

const getCotizacionesById = async (idUsuario) => {
  const { data } = await CotizacionesAPI.get(`/get/${idUsuario}`);
  return data;
};

const getCotizacionDetalle = async (id) => {
  const { data } = await CotizacionesAPI.get(`/getDetalle/${id}`);
  return data;
};

const getUltimasCotizaciones = async (idUsuario) => {
  const { data } = await CotizacionesAPI.get(`/ultimas/${idUsuario}`);
  return data;
};

const getInfoAdmin = async (idUsuario) => {
  const { data } = await CotizacionesAPI.get(
    `/getCotizacionesSum/${idUsuario}`
  );
  return data;
};

export const useVentas = (idUsuario, id) => {
  const ventasQueryById = useQuery({
    queryKey: ["venta", { ventaId: idUsuario }],
    queryFn: () => getVentaById(idUsuario),
    enabled: idUsuario !== undefined && idUsuario !== null,
  });

  const ventasQueryDetalle = useQuery({
    queryKey: ["ventadetalle", { venta: id }],
    queryFn: () => getVentasDetalleById(id),
    enabled: id !== undefined && id !== null,
  });

  return {
    ventasQueryById,
    ventasQueryDetalle,
  };
};

export const useCotizaciones = (idUsuario, id) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const CotizacionesPendientesDeAprobacion = useQuery({
    queryKey: ["cotispendientesdeaprobacion"],
    queryFn: getCotizacionParaSerAprobada,
  });

  const cotizacionMutation = useMutation({
    mutationKey: ["cotizacion-mutation"],
    mutationFn: (data) => postCotizacion(data),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "La cotización se guardó correctamente",
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
              title: "No se pudo guardar la cotización; intente más tarde",
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

  const cotizacionEditMutation = useMutation({
    mutationKey: ["edit-cotizacion"],
    mutationFn: (data) => editCotizacion(data),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Los datos de la cotización se actualizaron corréctamente",
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
              title: "No se pudieron actualizar los datos. Intente más tarde",
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

  const cotizacionEditPDFMutation = useMutation({
    mutationKey: ["editPDF-cotizacion"],
    mutationFn: (data) => editCotizacionPDF(data),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "El PDF se generó Corréctamente",
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
              title: "No se pudo generar el PDF. Intente más tarde",
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

  const cotizacionPorEmailMutation = useMutation({
    mutationKey: ["cotizacionPorEmail-mutation"],
    mutationFn: (data) => postEnvioCotizacionPorEmial(data),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "La cotización se envió por Email corréctamente",
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
              title: "No se pudo enviar la cotización; intente más tarde",
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

          case 404:
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "Las credenciales son incorrectas",
              showConfirmButton: false,
              timer: 2000,
              background: "#ffffff",
              iconColor: "#ffc107",
              customClass: {
                title: "text-dark",
              },
            });
            break;

          default:
            Swal.fire({
              position: "center",
              icon: "info",
              title: "Las credenciales no son válidas",
              background: "#ffffff",
              iconColor: "#dc3545",
              customClass: {
                title: "text-dark",
              },
              showConfirmButton: false,
              timer: 5000,
            });
            break;
        }
      }
    },
  });

  const cotisPorFechaMutation = useMutation({
    mutationKey: ["cotisPorFecha-cotizacion"],
    mutationFn: (data) => postCotisPorFecha(data),

    onError: (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            Swal.fire({
              position: "center",
              icon: "warning",
              title:
                "No se encontraron Cotizaciones con los valores ingresados",
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
      } else {
        Swal.fire({
          position: "center",
          icon: "info",
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

  const cotizacionesQueryById = useQuery({
    queryKey: ["coti", { cotizacionId: idUsuario }],
    queryFn: () => getCotizacionesById(idUsuario),
    enabled: idUsuario !== undefined && idUsuario !== null,
  });

  const cotizacionDetalleQuery = useQuery({
    queryKey: ["detallecotizacion", { detalleId: id }],
    queryFn: () => getCotizacionDetalle(id),
    enabled: id !== undefined && id !== null,
  });

  const cotizacionMutationState2 = useMutation({
    mutationKey: ["cotizacionState2-mutation"],
    mutationFn: (data) => postCotizacionState2(data),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Felicitaciones! Tu venta se concretó satisfactoriamente!",
        showConfirmButton: false,
        timer: 2000,
        background: "#ffffff",
        iconColor: "#ffc107",
        customClass: {
          title: "text-dark",
        },
      });
      queryClient.invalidateQueries(["coti", { cotizacionId: idUsuario }]);
    },

    onError: (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            Swal.fire({
              position: "center",
              icon: "info",
              title: "No se pudo guardar la venta. Intente más tarde",
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
    cotizacionMutation,
    cotizacionesQueryById,
    cotizacionDetalleQuery,
    cotizacionMutationState2,
    cotizacionEditMutation,
    cotisPorFechaMutation,
    CotizacionesPendientesDeAprobacion,
    cotizacionEditPDFMutation,
    cotizacionPorEmailMutation,
  };
};

export const useUltimasCotizaciones = (idUsuario) => {
  const ultimasCotizacionesQuery = useQuery({
    queryKey: ["ultimascoti", { ultimasCotizacionesId: idUsuario }],
    queryFn: () => getUltimasCotizaciones(idUsuario),
    enabled: idUsuario !== undefined && idUsuario !== null,
  });

  return {
    ultimasCotizacionesQuery,
  };
};

export const useInfoHomeAdmin = (idUsuario) => {
  const infoAdminQuery = useQuery({
    queryKey: ["ultimascoti", { infoAdminId: idUsuario }],
    queryFn: () => getInfoAdmin(idUsuario),
    enabled: idUsuario !== undefined && idUsuario !== null,
  });

  return {
    infoAdminQuery,
  };
};

const getRanking = async () => {
  const { data } = await CotizacionesAPI.get("/ranking");
  return data;
};

export const useRanking = () => {
  const rankingQuery = useQuery({
    queryKey: ["ranking"],
    queryFn: () => getRanking(),
  });

  return {
    rankingQuery,
  };
};
