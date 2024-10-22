const { Suscripcion } = require("../db.js");

const getAllSuscripciones = async (req, res) => {
  try {
    const suscripciones = await Suscripcion.findAll({
      attributes: ["email", "createdAt"],
    });
    res.status(200).json(suscripciones);
  } catch (error) {
    console.error("Error al obtener las suscripciones:", error);
    res.status(500).json({ message: "Error al obtener las suscripciones" });
  }
};

const createSuscripcion = async (req, res) => {
  const { email } = req.body;

  try {
    const nuevaSuscripcion = await Suscripcion.create({ email });
    res.status(201).json(nuevaSuscripcion);
  } catch (error) {
    console.error("Error al crear la suscripción:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      res
        .status(400)
        .json({ message: "Este correo electrónico ya está suscrito" });
    } else if (error.name === "SequelizeValidationError") {
      res.status(400).json({ message: "Correo electrónico no válido" });
    } else {
      res.status(500).json({ message: "Error al crear la suscripción" });
    }
  }
};

module.exports = {
  getAllSuscripciones,
  createSuscripcion,
};
