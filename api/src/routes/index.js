const { Router } = require("express");

const {
  login,
  registro,
  putUser,
  resetPassword,
  getAllUsers,
  getLastLoggedInUsers,
  verificarRol,
  getAllUsersMensajes,
  obtenerDetalleUsuario,
  getUsuariosConRolFalse,
  getUsuariosChart,
} = require("../controllers/Usuarios");
const {
  enviarMailsMasivos,
  enviarCotizacionPorEmail,
} = require("../mailer/mailer.js");

const {
  getProductos,
  getProductoById,
  putProductos,
  createProducto,
  deleteProducto,
  getProductosParaCotizar,
  getProductosPorCategoria,
  getProductosPorMarca,
  getProductosPorDivision,
} = require("../controllers/Productos");

const {
  createCotizacion,
  getCotizaciones,
  getCantidadCotizacionesPorUsuario,
  putCotizaciones,
  updateCotizacionEstado,
  sumarPreciosFinales,
  sumarPreciosFinalesPorMonedaYEstado,
  getCotizacionesEstadoDos,
  getVentaById,
  getCotizacionDetalle,
  getUltimasCotizaciones,
  getCotizacionesSum,
  filtrarCotizacionesPorFecha,
  getCotizacionesPorModelo,
  getranking,
  getCotizacionesEstadoTres,
  updateCotizacionPdf,
} = require("../controllers/Cotizaciones");

const {
  createCliente,
  getClientesPorIdDeUsuario,
  updateCliente,
  getClientePorId,
  getClientesParaCotizar,
  getMailsPorIdDeUsuario,
} = require("../controllers/Clientes");

const {
  eliminarCotizacionIndividual,
  actualizarEstadoCotizacionIndividualEstado3,
  actualizarEstadoCotizacionIndividualEstado2,
  contarCotizacionesEstado3,
} = require("../controllers/CotizacionIndividual");

const {
  getContactos,
  createContacto,
  countActiveContactos,
  updateContactoState,
  getContactoById,
  updateContactoUsuario,
} = require("../controllers/Contacto");
const {
  createContactoProducto,
  getContactoProductoById,
  getContactoProducto,
  updateContactoProductoUsuario,
} = require("../controllers/ContactoProducto");
const {
  getAllGarantias,
  getGarantiaById,
  createGarantia,
  updateGarantiaState,
  countActiveGarantias,
  updateGarantiaUsuario,
} = require("../controllers/Garantia");

const {
  createMessage,
  updateMessageState,
  getMessagesByUserAndDestination,
  countMessagesByDestination,
  getMensajesByUsuario,
  getMensajesByDestino,
  obtenerMensajePorId,
} = require("../controllers/Mensajes");

const {
  createRepuesto,
  getRepuestos,
  getRepuestoById,
  updateRepuestoUsuario,
} = require("../controllers/Repuestos");

const {
  getAllSolicitantes,
  createSolicitante,
} = require("../controllers/Solicitaciones");

const {
  getHistorialDetallePorUsuario,
} = require("../controllers/HistorialCotizacion");

const {
  getAllSuscripciones,
  createSuscripcion,
} = require("../controllers/Suscripcion");

const {
  createOfertaNovedad,
  updateOfertaNovedad,
  getOfertasNovedadesAsc,
  deleteOfertaNovedad,
} = require("../controllers/OfertasNovedades");

const {
  deleteFavorito,
  getFavoritosAsc,
  createFavorito,
} = require("../controllers/Favoritos.js");

const check = require("../middlewares/auth");

//VAMOS A USAR ESTO CUANDO NECESITEMOS TENER LOS DATOS DE DE SESION DEL USUARIO O CUANDO NECESITEMOS SEGURIDAD.

//PARA APLICAR EL MIDDLEWARE EN ALGUNA RUTA QUEDARIA ALGO ASI:

// router.get("/usuarios", check.auth, getUsers);
//En el postman se prueba poniendo dentro de la accion GET, en los headers, y en Authorization el TOKEN GENERADO

const router = Router();

router.post("/usuarios/login", login);
router.post("/usuarios/registro", registro);
router.post("/usuarios/rol", check.auth, verificarRol);
router.put("/usuarios", check.auth, putUser);
router.get("/usuarios/lastFive", check.auth, getLastLoggedInUsers);
router.get("/usuarios/chart", check.auth, getUsuariosChart);
router.get("/usuarios/detail/:idUsuario", check.auth, obtenerDetalleUsuario);
router.get("/usuarios/all", check.auth, getAllUsers);
router.get(
  "/usuarios/vendedores/:idUsuario",
  check.auth,
  getUsuariosConRolFalse
);
router.put("/usuarios/recoverpass", resetPassword);
router.get("/productos/getAll", check.auth, getProductos);
router.get("/productos/getParaCotizar", check.auth, getProductosParaCotizar);
router.get("/productos/getCategorias", getProductosPorCategoria);
router.get("/productos/getMarcas", getProductosPorMarca);
router.get("/productos/getDivisiones", getProductosPorDivision);
router.get("/productos/:id", getProductoById);
router.get(
  "/contactoProducto/detalle/:id",
  check.auth,
  getContactoProductoById
);
router.get("/contacto/detalle/:id", check.auth, getContactoById);
router.post("/productos/create", check.auth, createProducto);
router.put("/productos/edit", check.auth, putProductos);
router.delete("/productos/delete", check.auth, deleteProducto);
router.post("/cotizaciones/create", check.auth, createCotizacion);
router.get("/cotizaciones/get/:idUsuario", check.auth, getCotizaciones);
router.get(
  "/cotizaciones/getCotizacionesSum/:idUsuario",
  check.auth,
  getCotizacionesSum
);
router.get(
  "/cotizaciones/getDetalle/:idCotizacion",

  getCotizacionDetalle
);
router.get(
  "/cotizaciones/getVentas/:idUsuario",
  check.auth,
  getCotizacionesEstadoDos
);
router.get(
  "/countCotizaciones/get",
  check.auth,
  getCantidadCotizacionesPorUsuario
);
router.get("/Cotizaciones/ranking", check.auth, getranking);
router.delete("/Cotizaciones/delete", check.auth, eliminarCotizacionIndividual);
router.put("/cotizaciones/edit", check.auth, putCotizaciones);
router.put("/cotizaciones/editpdf", check.auth, updateCotizacionPdf);
router.post("/clientes/create", check.auth, createCliente);
router.get("/clientes/get/:idUsuario", check.auth, getClientesPorIdDeUsuario);
router.get(
  "/clientes/getEmails/:idUsuario",
  check.auth,
  getMailsPorIdDeUsuario
);
router.get("/clientes/getDetalle/:idCliente", check.auth, getClientePorId);
router.get(
  "/clientes/getParaCotizar/:idUsuario",
  check.auth,
  getClientesParaCotizar
);
router.put("/clientes/edit", check.auth, updateCliente);
router.get("/contacto/get", check.auth, getContactos);
router.get("/contacto/getNoLeidosCount", check.auth, countActiveContactos);
router.put("/contacto/put", check.auth, updateContactoState);
router.put("/contacto/derivado", check.auth, updateContactoUsuario);
router.post("/contacto/create", createContacto);
router.post(
  "/cotizaciones/enviocoti/create",
  check.auth,
  enviarCotizacionPorEmail
);
router.post("/mailsMasivos/create", check.auth, enviarMailsMasivos);
router.get("/contactoProducto/get", check.auth, getContactoProducto);
router.post("/contactoProducto/create", createContactoProducto);
router.put(
  "/contactoProducto/derivado",
  check.auth,
  updateContactoProductoUsuario
);
router.put("/cotizaciones/state", check.auth, updateCotizacionEstado);
router.get("/cotizaciones/suma", check.auth, sumarPreciosFinales);
router.get(
  "/cotizaciones/ultimas/:idUsuario",
  check.auth,
  getUltimasCotizaciones
);
router.get(
  "/cotizaciones/sumaVentas",
  check.auth,
  sumarPreciosFinalesPorMonedaYEstado
);
router.get("/usuarios/mensajes", check.auth, getAllUsersMensajes);
router.post("/mensajes/create", check.auth, createMessage);
router.put("/mensajes/put", check.auth, updateMessageState);
router.get("/mensajes/get", check.auth, getMessagesByUserAndDestination);
router.get(
  "/mensajes/count/:idUsuario",
  check.auth,
  countMessagesByDestination
);
router.get("/mensajes/enviados/:idUsuario", check.auth, getMensajesByUsuario);
router.get("/mensajes/detail/:idMensaje", check.auth, obtenerMensajePorId);
router.get("/mensajes/recibidos/:idUsuario", check.auth, getMensajesByDestino);
router.get("/solicitaciones/get", getAllSolicitantes);
router.post("/solicitaciones/create", createSolicitante);
router.get("/garantias/garantiasById/:id", check.auth, getGarantiaById);
router.get("/garantias/getAll", check.auth, getAllGarantias);
router.post("/garantias/create", createGarantia);
router.put("/garantias/put", check.auth, updateGarantiaState);
router.get("/garantias/getNoLeidosCount", check.auth, countActiveGarantias);
router.get("/cotizaciones/getVentasById/:id", check.auth, getVentaById);
router.post("/historial/vendedor/", check.auth, getHistorialDetallePorUsuario);
router.post("/historial/modelo/", check.auth, getCotizacionesPorModelo);
router.post("/cotizaciones/fecha/", check.auth, filtrarCotizacionesPorFecha);
router.post("/repuestos/create", createRepuesto);
router.get("/repuestos/get", check.auth, getRepuestos);
router.get("/repuestos/detalle/:id", check.auth, getRepuestoById);
router.put("/repuestos/derivado", check.auth, updateRepuestoUsuario);
router.put("/garantias/derivado", check.auth, updateGarantiaUsuario);
router.get("/ofertasNovedades/get", getOfertasNovedadesAsc);
router.post("/ofertasNovedades/create", check.auth, createOfertaNovedad);
router.put("/ofertasNovedades/edit", check.auth, updateOfertaNovedad);
router.delete("/ofertasNovedades/delete", check.auth, deleteOfertaNovedad);
router.get("/favoritos/get/:idUsuario", getFavoritosAsc);
router.post("/favoritos/create", createFavorito);
router.delete("/favoritos/delete", deleteFavorito);
router.get("/suscripcion/getAll", getAllSuscripciones);
router.post("/suscripcion/create", createSuscripcion);
router.put(
  "/cotizacionIndividual/estado2",
  actualizarEstadoCotizacionIndividualEstado2,
  check.auth
);
router.put(
  "/cotizacionIndividual/estado3",
  check.auth,
  actualizarEstadoCotizacionIndividualEstado3
);
router.get(
  "/cotizacionIndividual/getEstado3",
  check.auth,
  contarCotizacionesEstado3
);

router.get(
  "/cotizaciones/getCotizacionEstado3",
  check.auth,
  getCotizacionesEstadoTres
);

module.exports = router;
