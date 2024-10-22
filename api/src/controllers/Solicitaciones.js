const { Solicitantes } = require("../db.js");

const createSolicitante = async (req, res) => {
  try {
    const { nombreCompleto, email, telefonoCelular, envioCV } = req.body;
    if (!nombreCompleto || !email || !telefonoCelular || !envioCV) {
      throw "Faltan parámetros en el cuerpo de la solicitud";
    }

    const nuevoSolicitante = await Solicitantes.create({
      nombreCompleto,
      email,
      telefonoCelular,
      envioCV,
    });

    return res.status(201).json({ nuevoSolicitante });
  } catch (error) {
    console.error("Error al crear el solicitante:", error);
    return res.status(400).json({ error: "Error al crear el solicitante" });
  }
};

const getAllSolicitantes = async (req, res) => {
  try {
    const solicitantes = await Solicitantes.findAll();

    return res.status(200).json({ solicitantes });
  } catch (error) {
    console.error("Error al obtener los solicitantes:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  createSolicitante,
  getAllSolicitantes,
};
