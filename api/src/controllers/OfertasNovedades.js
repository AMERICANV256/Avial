const { OfertasNovedades } = require("../db.js");

const createOfertaNovedad = async (req, res) => {
  try {
    const { novedades, foto } = req.body;

    if (!novedades || typeof novedades !== "string") {
      return res.status(400).json({
        error:
          "El campo 'novedades' es requerido y debe ser una cadena de texto.",
      });
    }

    if (foto && typeof foto !== "string") {
      return res.status(400).json({
        error: "El campo 'foto' debe ser una cadena de texto si está presente.",
      });
    }

    const newOfertaNovedad = await OfertasNovedades.create({
      novedades,
      foto,
    });

    return res.status(201).json(newOfertaNovedad);
  } catch (error) {
    console.error("Error al crear la oferta/novedad:", error);
    return res.status(500).json({
      error: "No se pudo crear la oferta/novedad",
    });
  }
};

const updateOfertaNovedad = async (req, res) => {
  const { id, novedades, foto } = req.body;
  try {
    const ofertaNovedad = await OfertasNovedades.findByPk(id);
    if (!ofertaNovedad) {
      return res
        .status(404)
        .json({ error: `Oferta/Novedad con id ${id} no encontrada` });
    }

    ofertaNovedad.novedades = novedades;
    ofertaNovedad.foto = foto;

    await ofertaNovedad.save();
    return res.status(200).json(ofertaNovedad);
  } catch (error) {
    return res.status(500).json({
      error: `Error al actualizar la oferta/novedad: ${error.message}`,
    });
  }
};

const getOfertasNovedadesAsc = async (req, res) => {
  try {
    const ofertasNovedades = await OfertasNovedades.findAll({
      order: [["id", "DESC"]],
    });
    return res.status(200).json(ofertasNovedades);
  } catch (error) {
    console.error("Error al obtener las ofertas/novedades:", error);
    return res.status(500).json({
      error: `Error al obtener las ofertas/novedades: ${error.message}`,
    });
  }
};

const deleteOfertaNovedad = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await OfertasNovedades.destroy({
      where: { id },
    });

    if (result === 0) {
      return res
        .status(404)
        .json({ error: `Oferta/Novedad con id ${id} no encontrada` });
    }

    return res
      .status(200)
      .json({ message: `Oferta/Novedad con id ${id} eliminada correctamente` });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error al eliminar la oferta/novedad: ${error.message}` });
  }
};

module.exports = {
  createOfertaNovedad,
  updateOfertaNovedad,
  getOfertasNovedadesAsc,
  deleteOfertaNovedad,
};
