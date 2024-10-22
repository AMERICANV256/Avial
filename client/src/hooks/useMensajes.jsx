// import { useMutation, useQuery } from "@tanstack/react-query";
// import { mensajesAPI } from "../components/api/MensajesAPI";

// const getCountMensajesNoLidos = async (idUsuario) => {
//   const { data } = await mensajesAPI.get(`/count/${idUsuario}`);
//   return data;
// };

// const getCountMensajesEnviados = async (idUsuario) => {
//   const { data } = await mensajesAPI.get(`/enviados/${idUsuario}`);
//   return data;
// };

// const getMensajesRecibidos = async (idUsuario) => {
//   const { data } = await mensajesAPI.get(`/recibidos/${idUsuario}`);
//   return data;
// };

// const getMensajesDetail = async (idMensaje) => {
//   const { data } = await mensajesAPI.get(`/detail/${idMensaje}`);
//   return data;
// };

// const postMensaje = async (data) => {
//   return await mensajesAPI.post(`create`, data);
// };

// const putMensajeState2 = async (data) => {
//   return await mensajesAPI.put(`put`, { idMensaje: data.id });
// };

// export const useMensajes = (idUsuario, idMensaje) => {
//   const MensajesCountQuery = useQuery({
//     queryKey: ["mensajenoleido", { mensajeNoLeidoId: idUsuario }],
//     queryFn: () => getCountMensajesNoLidos(idUsuario),
//     enabled: idUsuario !== undefined && idUsuario !== null,
//   });

//   const MensajesDetailQuery = useQuery({
//     queryKey: ["mensajeDetail", { id: idMensaje }],
//     queryFn: () => getMensajesDetail(idMensaje),
//     enabled: idMensaje !== undefined && idMensaje !== null,
//   });

//   const mensajesMutation = useMutation({
//     mutationKey: ["mensajes-mutation"],
//     mutationFn: (data) => postMensaje(data),
//     onSuccess: () => {
//       MensajesCountQuery.refetch();
//     },
//   });

//   const MensajesEnviadosQuery = useQuery({
//     queryKey: ["mensajesEnviados", { mensajeEnviadosId: idUsuario }],
//     queryFn: () => getCountMensajesEnviados(idUsuario),
//     enabled: idUsuario !== undefined && idUsuario !== null,
//   });

//   const MensajesRecibidosQuery = useQuery({
//     queryKey: ["mensajesRecibidos", { mensajeRecibidoId: idUsuario }],
//     queryFn: () => getMensajesRecibidos(idUsuario),
//     enabled: idUsuario !== undefined && idUsuario !== null,
//   });

//   const mensajeMutationState2 = useMutation({
//     mutationKey: ["mensajeState2-mutation"],
//     mutationFn: (data) => putMensajeState2(data),
//     onSuccess: () => {
//       MensajesCountQuery.refetch();
//     },
//   });
//   return {
//     MensajesCountQuery,
//     mensajesMutation,
//     MensajesEnviadosQuery,
//     MensajesRecibidosQuery,
//     mensajeMutationState2,
//     MensajesDetailQuery,
//   };
// };
