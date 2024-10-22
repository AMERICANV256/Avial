const { Mensajes, Usuarios } = require("../db.js");
const { Op } = require("sequelize");
const { conn } = require("../db.js");
const { JWTSECRET } = process.env;
const jwt = require("../services/jwt.js");

const createMessage = async (req, res) => {
  try {
    const { idDestino, Mensaje } = req.body;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ error: "Token no proporcionado" });
    }

    const decodedToken = jwt.decodeToken(
      token.replace("Bearer ", ""),
      JWTSECRET
    );

    const idUsuario = decodedToken.id;

    if (!idUsuario || !idDestino || !Mensaje) {
      throw "Faltan parámetros en el cuerpo de la solicitud";
    }

    const nuevoMensaje = await Mensajes.create({
      idUsuario,
      idDestino,
      Mensaje,
    });

    return res
      .status(201)
      .json({ message: "Mensaje creado correctamente", nuevoMensaje });
  } catch (error) {
    console.error("Error al crear mensaje:", error);
    return res.status(400).json({ error: "Error al crear mensaje" });
  }
};

const getMessagesByUserAndDestination = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ error: "Token no proporcionado" });
    }

    const decodedToken = jwt.decodeToken(
      token.replace("Bearer ", ""),
      JWTSECRET
    );

    const idUsuario = decodedToken.id;

    if (!idUsuario) {
      throw "Se requiere el ID de usuario";
    }

    const mensajes = await Mensajes.findAll({
      where: {
        [Op.or]: [{ idUsuario }, { idDestino: idUsuario }],
      },
    });

    return res.status(200).json({ mensajes });
  } catch (error) {
    console.error("Error al obtener mensajes por usuario y destino:", error);
    return res
      .status(400)
      .json({ error: "Error al obtener mensajes por usuario y destino" });
  }
};

// FUNCION QUE CUENTA LOS MENSAJES NO LEIDOS DE CADA USUARIO SI EL ESTADO ES 1 (NO LEIDO)

const countMessagesByDestination = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ error: "Token no proporcionado" });
    }

    const decodedToken = jwt.decodeToken(
      token.replace("Bearer ", ""),
      JWTSECRET
    );

    const idUsuario = decodedToken.id;

    if (!idUsuario) {
      throw "Se requiere el ID de usuario";
    }

    const count = await Mensajes.count({
      where: {
        estado: 1,
        idDestino: idUsuario,
      },
    });

    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error al contar mensajes por destino:", error);
    return res
      .status(400)
      .json({ error: "Error al contar mensajes por destino" });
  }
};

// ESTADO 1= NO LEIDO    ESTADO 2: LEIDO

const updateMessageState = async (req, res) => {
  try {
    const { idMensaje } = req.body;

    if (!idMensaje) {
      throw "Se requiere el ID del mensaje";
    }

    const mensaje = await Mensajes.findByPk(idMensaje);

    if (!mensaje) {
      throw "Mensaje no encontrado";
    }

    await mensaje.update({ estado: 2 });

    return res.status(200).json({ mensaje });
  } catch (error) {
    console.error("Error al actualizar el estado del mensaje:", error);
    return res
      .status(400)
      .json({ error: "Error al actualizar el estado del mensaje" });
  }
};

const getMensajesByUsuario = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ error: "Token no proporcionado" });
    }

    const decodedToken = jwt.decodeToken(
      token.replace("Bearer ", ""),
      JWTSECRET
    );

    const idUsuario = decodedToken.id;

    if (!idUsuario) {
      return res.status(400).json({ error: "Se requiere el ID de usuario" });
    }

    const mensajes = await Mensajes.findAll({
      where: {
        idUsuario: idUsuario,
      },
      include: [
        {
          model: Usuarios,

          attributes: ["email"],
        },
      ],
    });

    if (!mensajes || mensajes.length === 0) {
      return res.status(404).json({ error: "No se encontraron mensajes" });
    }

    return res.status(200).json(mensajes);
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    return res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};

const getMensajesByDestino = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ error: "Token no proporcionado" });
    }

    const decodedToken = jwt.decodeToken(
      token.replace("Bearer ", ""),
      JWTSECRET
    );

    const idUsuario = decodedToken.id;

    if (!idUsuario) {
      return res.status(400).json({ error: "Se requiere el ID de usuario" });
    }

    const mensajes = await Mensajes.findAll({
      where: {
        idDestino: idUsuario,
      },
      include: [
        {
          model: Usuarios,
          as: "Emisor", // Alias para el emisor
          attributes: ["email"],
        },
      ],
    });

    if (!mensajes || mensajes.length === 0) {
      return res.status(404).json({ error: "No se encontraron mensajes" });
    }

    return res.status(200).json(mensajes);
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    return res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};

const obtenerMensajePorId = async (req, res) => {
  try {
    const { idMensaje } = req.params;

    if (!idMensaje) {
      throw "Se requiere el ID del mensaje";
    }

    const mensaje = await Mensajes.findByPk(idMensaje, {
      attributes: ["id", "Mensaje", "fechaDeEnvio"],
    });

    if (!mensaje) {
      throw "Mensaje no encontrado";
    }

    return res.status(200).json({ mensaje });
  } catch (error) {
    console.error("Error al obtener el mensaje por ID:", error);
    return res
      .status(400)
      .json({ error: "Error al obtener el mensaje por ID" });
  }
};
module.exports = {
  createMessage,
  getMessagesByUserAndDestination,
  updateMessageState,
  countMessagesByDestination,
  getMensajesByUsuario,
  getMensajesByDestino,
  obtenerMensajePorId,
};
