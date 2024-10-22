const { HistorialCotizacion } = require("../db.js");
const { Op } = require("sequelize");

const getHistorialDetallePorUsuario = async (req, res) => {
  try {
    const { combinedValue } = req.body;

    if (!combinedValue) {
      return res.status(400).json({ error: "Se requiere el valor combinado" });
    }

    // Separar el idUsuario y el numeroCotizacion desde combinedValue
    const [idUsuario, numeroCotizacion] = combinedValue.split("-");

    // Quitar espacios y juntar nuevamente el idUsuario y numeroCotizacion
    const formattedNumeroCotizacion = `${idUsuario} - ${numeroCotizacion}`;

    const detalle = await HistorialCotizacion.findAll({
      where: {
        numeroCotizacion: formattedNumeroCotizacion,
      },
    });

    if (!detalle || detalle.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron detalles para este usuario" });
    }

    return res.status(200).json(detalle);
  } catch (error) {
    console.error("Error al obtener el detalle por usuario:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener el detalle por usuario" });
  }
};

module.exports = {
  getHistorialDetallePorUsuario,
};
