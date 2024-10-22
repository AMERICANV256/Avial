const { CotizacionIndividual } = require("../db.js");
const { Cotizaciones } = require("../db.js");
const { Clientes } = require("../db.js");
const { Productos } = require("../db.js");
const { Usuarios } = require("../db.js");
const { HistorialCotizacion } = require("../db.js");

const eliminarCotizacionIndividual = async (req, res) => {
  try {
    const { idCotizacionIndividual } = req.body;

    if (!idCotizacionIndividual) {
      return res
        .status(400)
        .send({ error: "Se requiere el ID de la cotización individual" });
    }

    const cotizacionIndividual = await CotizacionIndividual.findByPk(
      idCotizacionIndividual
    );

    // Verificar si la cotización individual existe
    if (!cotizacionIndividual) {
      return res
        .status(404)
        .send({ error: "Cotización individual no encontrada" });
    }

    await CotizacionIndividual.destroy({
      where: { id: idCotizacionIndividual },
    });

    return res
      .status(200)
      .send({ message: "Cotización individual eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar cotización individual:", error);
    return res.status(500).send({
      error: error.message || "Error al eliminar cotización individual",
    });
  }
};

const actualizarEstadoCotizacionIndividualEstado2 = async (req, res) => {
  try {
    const { id } = req.body;

    // Verifica si se envió el idCotizacionIndividual
    if (!id) {
      return res
        .status(400)
        .send({ error: "Se requiere el ID de la cotización individual" });
    }

    // Busca la cotización individual por su id
    const cotizacionIndividual = await CotizacionIndividual.findByPk(id);

    // Verifica si la cotización individual existe
    if (!cotizacionIndividual) {
      return res
        .status(404)
        .send({ error: "Cotización individual no encontrada" });
    }

    // Actualiza el estado a 2 y establece la fecha de venta
    await cotizacionIndividual.update({ estado: 2, fechaVenta: new Date() });

    // Busca la cotización relacionada
    const cotizacion = await Cotizaciones.findOne({
      where: { id: cotizacionIndividual.idCotizacion },
    });

    if (!cotizacion) {
      return res.status(404).send({ error: "Cotización no encontrada" });
    }

    await cotizacion.update({ fechaVenta: new Date() });

    // Obtener cliente, producto y vendedor
    const cliente = await Clientes.findOne({
      where: { id: cotizacion.idCliente },
      attributes: ["nombre", "apellido", "mail"],
    });

    if (!cliente) {
      return res.status(404).send({ error: "Cliente no encontrado" });
    }

    const producto = await Productos.findOne({
      where: { id: cotizacion.idProducto },
      attributes: ["familia", "marca", "modelo"],
    });

    if (!producto) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    const usuario = await Usuarios.findOne({
      where: { id: cotizacion.idUsuario },
      attributes: ["nombre", "apellido", "codigo"],
    });

    if (!usuario) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    // Crear un nuevo registro en HistorialCotizacion
    await HistorialCotizacion.create({
      numeroCotizacion: cotizacion.numeroCotizacion,
      precio: cotizacionIndividual.precio || null,
      anticipo: cotizacionIndividual.anticipo || null,
      saldoAFinanciar: cotizacionIndividual.saldoAFinanciar || null,
      IVA: cotizacionIndividual.IVA || null,
      moneda: cotizacionIndividual.moneda || null,
      interes: cotizacionIndividual.interes || null,
      saldo: cotizacionIndividual.saldo || null,
      cuotas: cotizacionIndividual.cuotas || null,
      cuotaValor: cotizacionIndividual.cuotaValor || null,
      saldoConInteres: cotizacionIndividual.saldoConInteres || null,
      PrecioFinal: cotizacionIndividual.PrecioFinal || null,
      codigoCotizacion: cotizacion.codigoCotizacion,
      fechaDeCreacion: cotizacion.fechaDeCreacion,
      fechaModi: cotizacion.fechaModi,
      nombreCliente: cliente.nombre || "",
      apellidoCliente: cliente.apellido || "",
      mailCliente: cliente.mail || "",
      familia: producto.familia || "",
      marca: producto.marca || "",
      modelo: producto.modelo || "",
      estado: 2,
      fechaDeCreacion: new Date(),
      apellidoVendedor: usuario.apellido || "",
      nombreVendedor: usuario.nombre || "",
      codigo: usuario.codigo || "",
      notasUsuario: cotizacion.notasUsuario || "",
    });

    return res.status(200).send({
      message:
        "Estado de la cotización individual actualizado a 2 y guardado en historial correctamente",
      cotizacion: cotizacionIndividual,
    });
  } catch (error) {
    console.error(
      "Error al actualizar el estado de la cotización individual:",
      error
    );
    return res.status(500).send({
      error:
        error.message ||
        "Error al actualizar el estado de la cotización individual",
    });
  }
};

const actualizarEstadoCotizacionIndividualEstado3 = async (req, res) => {
  try {
    const { id } = req.body;

    // Verifica si se envió el idCotizacionIndividual
    if (!id) {
      return res
        .status(400)
        .send({ error: "Se requiere el ID de la cotización individual" });
    }

    // Busca la cotización individual por su id
    const cotizacionIndividual = await CotizacionIndividual.findByPk(id);

    // Verifica si la cotización individual existe
    if (!cotizacionIndividual) {
      return res
        .status(404)
        .send({ error: "Cotización individual no encontrada" });
    }

    // Actualiza el estado a 3
    await cotizacionIndividual.update({ estado: 3 });

    const cotizacion = await Cotizaciones.findOne({
      where: { id: cotizacionIndividual.idCotizacion },
    });

    if (!cotizacion) {
      return res.status(404).send({ error: "Cotización no encontrada" });
    }

    const cliente = await Clientes.findOne({
      where: { id: cotizacion.idCliente },
      attributes: ["nombre", "apellido", "mail"],
    });

    if (!cliente) {
      return res.status(404).send({ error: "Cliente no encontrado" });
    }

    const producto = await Productos.findOne({
      where: { id: cotizacion.idProducto },
      attributes: ["familia", "marca", "modelo"],
    });

    if (!producto) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    const usuario = await Usuarios.findOne({
      where: { id: cotizacion.idUsuario },
      attributes: ["nombre", "apellido", "codigo"],
    });

    if (!usuario) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    // Crear un nuevo registro en HistorialCotizacion
    await HistorialCotizacion.create({
      numeroCotizacion: cotizacion.numeroCotizacion,
      precio: cotizacionIndividual.precio || null,
      anticipo: cotizacionIndividual.anticipo || null,
      saldoAFinanciar: cotizacionIndividual.saldoAFinanciar || null,
      IVA: cotizacionIndividual.IVA || null,
      moneda: cotizacionIndividual.moneda || null,
      interes: cotizacionIndividual.interes || null,
      saldo: cotizacionIndividual.saldo || null,
      cuotas: cotizacionIndividual.cuotas || null,
      cuotaValor: cotizacionIndividual.cuotaValor || null,
      saldoConInteres: cotizacionIndividual.saldoConInteres || null,
      PrecioFinal: cotizacionIndividual.PrecioFinal || null,
      codigoCotizacion: cotizacion.codigoCotizacion,
      fechaDeCreacion: cotizacion.fechaDeCreacion,
      fechaModi: cotizacion.fechaModi,
      nombreCliente: cliente.nombre || "",
      apellidoCliente: cliente.apellido || "",
      mailCliente: cliente.mail || "",
      familia: producto.familia || "",
      marca: producto.marca || "",
      modelo: producto.modelo || "",
      estado: 3,
      apellidoVendedor: usuario.apellido || "",
      nombreVendedor: usuario.nombre || "",
      codigo: usuario.codigo || "",
      notasUsuario: cotizacion.notasUsuario || "",
      fechaDeCreacion: new Date(),
    });

    return res.status(200).send({
      message:
        "Estado de la cotización individual actualizado a 3 correctamente",
      cotizacion: cotizacionIndividual,
    });
  } catch (error) {
    console.error(
      "Error al actualizar el estado de la cotización individual:",
      error
    );
    return res.status(500).send({
      error:
        error.message ||
        "Error al actualizar el estado de la cotización individual",
    });
  }
};

const contarCotizacionesEstado3 = async (req, res) => {
  try {
    // Contar todas las cotizaciones con estado 3
    const count = await CotizacionIndividual.count({
      where: { estado: 3 },
    });

    return res.status(200).send({
      message: "Conteo de cotizaciones con estado 3 exitoso",
      count,
    });
  } catch (error) {
    console.error("Error al contar las cotizaciones con estado 3:", error);
    return res.status(500).send({
      error: error.message || "Error al contar las cotizaciones con estado 3",
    });
  }
};

module.exports = {
  eliminarCotizacionIndividual,
  actualizarEstadoCotizacionIndividualEstado2,
  actualizarEstadoCotizacionIndividualEstado3,
  contarCotizacionesEstado3,
};
