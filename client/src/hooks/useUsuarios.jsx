import { useMutation, useQuery } from "@tanstack/react-query";
import { UsuariosAPI } from "../components/api/UsuariosApi";

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
