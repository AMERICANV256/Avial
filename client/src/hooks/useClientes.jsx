import { useMutation, useQuery } from "@tanstack/react-query";
import { ClientesAPI } from "../components/api/ClientesApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const getClientesParaCotizar = async (idUsuario) => {
  const { data } = await ClientesAPI.get(`/getParaCotizar/${idUsuario}`);
  return data;
};

const getClientesEmails = async (idUsuario) => {
  const { data } = await ClientesAPI.get(`/getEmails/${idUsuario}`);
  return data;
};

const postCliente = async (data) => {
  return await ClientesAPI.post(`create`, data);
};

const editCliente = async (data) => {
  return await ClientesAPI.put(`edit`, data);
};

const getClientesById = async (idUsuario) => {
  const { data } = await ClientesAPI.get(`/get/${idUsuario}`);
  return data;
};

const getClientesDetalle = async (id) => {
  const { data } = await ClientesAPI.get(`/getDetalle/${id}`);
  return data;
};

export const useClientes = (idUsuario, id) => {
  const navigate = useNavigate();

  const clienteoQuery = useQuery({
    queryKey: ["clientes", { clienteId: idUsuario }],
    queryFn: () => getClientesParaCotizar(idUsuario),
    enabled: idUsuario !== undefined && idUsuario !== null,
  });

  const clientesEmailsQuery = useQuery({
    queryKey: ["clientesEmails", { clienteId: idUsuario }],
    queryFn: () => getClientesEmails(idUsuario),
    enabled: idUsuario !== undefined && idUsuario !== null,
  });

  const clientesMutation = useMutation({
    mutationKey: ["create-cliente"],
    mutationFn: (data) => postCliente(data),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "El Cliente fue cargado Exitósamente",
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
              title: "El cliente ingresado ya se encuentra en la base de datos",
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

  const clientesEditMutation = useMutation({
    mutationKey: ["edit-cliente"],
    mutationFn: (data) => editCliente(data),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Los datos del cliente se actualizaron correctamente",
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

  const clientesQueryById = useQuery({
    queryKey: ["clienteById", { clienteId: idUsuario }],
    queryFn: () => getClientesById(idUsuario),
    enabled: idUsuario !== undefined && idUsuario !== null,
  });

  const clientesQueryDetalle = useQuery({
    queryKey: ["clientedetalle", { cliente: id }],
    queryFn: () => getClientesDetalle(id),
    enabled: id !== undefined && id !== null,
  });

  return {
    clienteoQuery,
    clientesMutation,
    clientesQueryById,
    clientesQueryDetalle,
    clientesEditMutation,
    clientesEmailsQuery,
  };
};
