import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UsuariosAPI } from "../components/api/UsuariosApi";
import Swal from "sweetalert2";

const getUsuarios = async () => {
  const { data } = await UsuariosAPI.get("/all");
  return data;
};

const getUsuariosMensajes = async () => {
  const { data } = await UsuariosAPI.get("/mensajes");
  return data;
};

const getLastFive = async () => {
  const { data } = await UsuariosAPI.get("/lastfive");
  return data;
};

const getChart = async () => {
  const { data } = await UsuariosAPI.get("/chart");
  return data;
};

const getVendedores = async (idUsuario) => {
  const { data } = await UsuariosAPI.get(`/vendedores/${idUsuario}`);
  return data;
};

const getUsuarioDetail = async (idUsuario) => {
  const { data } = await UsuariosAPI.get(`/detail/${idUsuario}`);
  return data;
};

const checkRol = async (data) => {
  return await UsuariosAPI.post(`/rol`, data);
};

export const useUsuario = (idUsuario) => {
  const usuariosQuery = useQuery({
    queryKey: ["usuarios"],
    queryFn: () => getUsuarios(),
  });

  const usuariosChartQuery = useQuery({
    queryKey: ["usuariosChart"],
    queryFn: () => getChart(),
  });

  const CheckRolMutation = useMutation({
    mutationKey: ["checkRol-mutation"],
    mutationFn: (data) => checkRol(data),
  });

  const UsuarioDetailQuery = useQuery({
    queryKey: ["usuarioDetail", { id: idUsuario }],
    queryFn: () => getUsuarioDetail(idUsuario),
    enabled: idUsuario !== undefined && idUsuario !== null,
  });

  const fiveQuery = useQuery({
    queryKey: ["five"],
    queryFn: () => getLastFive(),
  });

  const vendedoresQuery = useQuery({
    queryKey: ["vendedores", idUsuario],
    queryFn: () => getVendedores(idUsuario),
    enabled: idUsuario !== undefined && idUsuario !== null,
  });

  const usuariosMensajesQuery = useQuery({
    queryKey: ["usuariosMensajes"],
    queryFn: () => getUsuariosMensajes(),
  });

  return {
    usuariosQuery,
    fiveQuery,
    usuariosMensajesQuery,
    UsuarioDetailQuery,
    vendedoresQuery,
    CheckRolMutation,
    usuariosChartQuery,
  };
};

const darDeBajaUsuario = async (idUsuario) => {
  const { data } = await UsuariosAPI.put("/baja", { id: idUsuario });
  return data;
};

export const useDarDeBajaUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: darDeBajaUsuario,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["usuarios"]);

      Swal.fire({
        icon: "success",
        title: "Usuario dado de baja",
        text: `El usuario ${
          data?.data?.email || ""
        } fue dado de baja correctamente.`,
        confirmButtonColor: "#3085d6",
      });
    },
    onError: (error) => {
      console.error("Error al dar de baja usuario:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo dar de baja al usuario.",
        confirmButtonColor: "#d33",
      });
    },
  });
};

const darDeAltaUsuario = async (idUsuario) => {
  const { data } = await UsuariosAPI.put("/alta", { id: idUsuario });
  return data;
};

export const useDarDeAltaUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: darDeAltaUsuario,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["usuarios"]);

      Swal.fire({
        icon: "success",
        title: "Usuario dado de alta",
        text: `El usuario ${
          data?.data?.email || ""
        } fue dado de alta correctamente.`,
        confirmButtonColor: "#3085d6",
      });
    },
    onError: (error) => {
      console.error("Error al dar de alta el usuario:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo dar de alta al usuario.",
        confirmButtonColor: "#d33",
      });
    },
  });
};
