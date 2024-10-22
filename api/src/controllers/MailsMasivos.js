const { MailsMasivos } = require("../db.js");
const { Op } = require("sequelize");

const enviarMailsMasivos = async (req, res) => {
  try {
    const { emailEmisor, emailsReceptores, cuerpoMensaje } = req.body;

    if (!emailEmisor || !emailsReceptores || emailsReceptores.length === 0) {
      return res
        .status(400)
        .json({ error: "Emisor y receptores son requeridos." });
    }

    const correosMasivos = emailsReceptores.map((emailReceptor) => ({
      emailEmisor,
      emailReceptor,
      cuerpoMensaje,
    }));

    const resultado = await MailsMasivos.bulkCreate(correosMasivos, {
      ignoreDuplicates: true,
    });

    return res.status(201).json({
      message: "Correos enviados exitosamente.",
      resultado,
    });
  } catch (error) {
    console.error("Error al enviar correos masivos:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

module.exports = {
  enviarMailsMasivos,
};
