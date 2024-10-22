const { Garantia, Usuarios } = require("../db.js");
const sendEmailWithTemplate = require("../mailer/sendEmailWithTemplate");

// FUNCION PARA CREAR LA GARANCIA

const createGarantia = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      empresa,
      email,
      telefono,
      tipoDeMaquina,
      marca,
      modelo,
      numeroDeChasis,
      fechaEntregaDelEquipo,
      ubicacion,
      cantidadHorasHorometro,
      falla,
    } = req.body;

    if (
      !nombre ||
      !apellido ||
      !empresa ||
      !email ||
      !telefono ||
      !tipoDeMaquina ||
      !marca ||
      !modelo ||
      !numeroDeChasis ||
      !fechaEntregaDelEquipo ||
      !ubicacion ||
      !cantidadHorasHorometro ||
      !falla
    ) {
      throw "Todos los campos son requeridos";
    }

    const nuevaGarantia = await Garantia.create({
      nombre,
      apellido,
      empresa,
      email,
      telefono,
      tipoDeMaquina,
      marca,
      modelo,
      numeroDeChasis,
      fechaEntregaDelEquipo,
      ubicacion,
      cantidadHorasHorometro,
      falla,
    });

    await sendEmailWithTemplate(email, "Contacto");

    return res.status(201).json(nuevaGarantia);
  } catch (error) {
    console.error("Error al crear la garantía:", error);
    return res.status(400).json({ error: "No se pudo crear la garantía" });
  }
};

const getAllGarantias = async (req, res) => {
  try {
    const garantias = await Garantia.findAll({
      attributes: [
        "id",
        "empresa",
        "email",
        "modelo",
        "falla",
        "fechaCrea",
        "idUsuario",
      ],

      order: [["fechaCrea", "DESC"]],
    });

    return res.status(200).json(garantias);
  } catch (error) {
    console.error("Error al obtener las garantías:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ESTA FUNCION ES PARA EL DETALLE DE LA GARANTIA

const getGarantiaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw "Se requiere el ID de la garantía";
    }

    const garantia = await Garantia.findByPk(id, {
      include: {
        model: Usuarios,
        attributes: ["email", "nombre", "apellido"],
      },
    });

    if (!garantia) {
      return res.status(404).json({ error: "Garantía no encontrada" });
    }

    return res.status(200).json(garantia);
  } catch (error) {
    console.error("Error al obtener la garantía por ID:", error);
    return res
      .status(400)
      .json({ error: "Error al obtener la garantía por ID" });
  }
};

const updateGarantiaState = async (req, res) => {
  try {
    const { idGarantia } = req.body;

    if (!idGarantia) {
      throw "Se requiere el ID de la garantía";
    }

    const garantia = await Garantia.findByPk(idGarantia);

    if (!garantia) {
      throw "Garantía no encontrada";
    }

    await garantia.update({ estado: 2 });

    return res.status(200).json({ garantia });
  } catch (error) {
    console.error("Error al actualizar el estado de la garantía:", error);
    return res
      .status(400)
      .json({ error: "Error al actualizar el estado de la garantía" });
  }
};

const countActiveGarantias = async (req, res) => {
  try {
    const activeGarantiasCount = await Garantia.count({
      where: {
        estado: 1,
      },
    });

    return res.status(200).json({ activeGarantiasCount });
  } catch (error) {
    console.error("Error al contar las garantías activas:", error);
    return res
      .status(500)
      .json({ error: "Error al contar las garantías activas" });
  }
};

const updateGarantiaUsuario = async (req, res) => {
  try {
    const { idGarantia, idUsuario } = req.body;

    if (!idGarantia || !idUsuario) {
      return res.status(400).json({
        error: "Se requieren el ID de la garantía y el ID del usuario",
      });
    }

    const garantia = await Garantia.findByPk(idGarantia);

    if (!garantia) {
      return res.status(404).json({ error: "Garantía no encontrada" });
    }

    await garantia.update({ idUsuario });

    return res.status(200).json({ garantia });
  } catch (error) {
    console.error("Error al actualizar el usuario de la garantía:", error);
    return res
      .status(500)
      .json({ error: "Error al actualizar el usuario de la garantía" });
  }
};

module.exports = {
  createGarantia,
  getAllGarantias,
  getGarantiaById,
  updateGarantiaState,
  countActiveGarantias,
  updateGarantiaUsuario,
};
