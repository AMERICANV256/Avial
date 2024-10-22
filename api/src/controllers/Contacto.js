const { Contacto, Usuarios } = require("../db.js");
const sendEmailWithTemplate = require("../mailer/sendEmailWithTemplate");

const createContacto = async (req, res) => {
  try {
    const { nombre, apellidos, email, telefono, direccion, consulta } =
      req.body;

    if (
      !nombre ||
      !apellidos ||
      !email ||
      !telefono ||
      !direccion ||
      !consulta
    ) {
      throw "Faltan parámetros en el cuerpo de la solicitud";
    }

    // Crea un nuevo contacto en la base de datos
    const nuevoContacto = await Contacto.create({
      nombre,
      apellidos,
      email,
      telefono,
      direccion,
      consulta,
    });

    await sendEmailWithTemplate(email, "Contacto");

    // Devuelve el contacto creado
    return res.status(201).json(nuevoContacto);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

// Función para obtener todos los contactos
const getContactos = async (req, res) => {
  try {
    const contactos = await Contacto.findAll({
      include: {
        model: Usuarios,
        attributes: ["email", "nombre", "apellido"],
      },
      order: [["createdAt", "DESC"]],
    });

    if (!contactos || contactos.length === 0) {
      return res.status(404).send("No hay contactos");
    }

    return res.status(200).json(contactos);
  } catch (error) {
    console.error("Error al obtener los contactos:", error);
    return res.status(400).send(error);
  }
};

const getContactoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("Se requiere el ID del contacto");
    }

    const contacto = await Contacto.findByPk(id, {
      include: {
        model: Usuarios,
        attributes: ["email", "nombre", "apellido"],
      },
    });

    if (!contacto) {
      return res.status(404).send("Contacto no encontrado");
    }

    return res.status(200).json(contacto);
  } catch (error) {
    console.error("Error al obtener el contacto:", error);
    return res.status(500).send("Error al obtener el contacto");
  }
};

const updateContactoState = async (req, res) => {
  try {
    const { idContacto } = req.body;

    if (!idContacto) {
      throw "Se requiere el ID del contacto";
    }

    const contacto = await Contacto.findByPk(idContacto);

    if (!contacto) {
      throw "Contacto no encontrado";
    }

    await contacto.update({ estado: 2 });

    return res.status(200).json({ contacto });
  } catch (error) {
    console.error("Error al actualizar el estado del contacto:", error);
    return res
      .status(400)
      .json({ error: "Error al actualizar el estado del contacto" });
  }
};

const updateContactoUsuario = async (req, res) => {
  try {
    const { idContacto, idUsuario } = req.body;

    if (!idContacto || !idUsuario) {
      throw "Se requieren el ID del contacto y el ID del usuario";
    }

    const contacto = await Contacto.findByPk(idContacto);

    if (!contacto) {
      throw "Contacto no encontrado";
    }

    await contacto.update({ idUsuario });

    return res.status(200).json({ contacto });
  } catch (error) {
    console.error("Error al actualizar el usuario del contacto:", error);
    return res
      .status(400)
      .json({ error: "Error al actualizar el usuario del contacto" });
  }
};

const countActiveContactos = async (req, res) => {
  try {
    const activeContactosCount = await Contacto.count({
      where: {
        estado: 1,
      },
    });

    return res.status(200).json({ activeContactosCount });
  } catch (error) {
    console.error("Error al contar los contactos activos:", error);
    return res
      .status(500)
      .json({ error: "Error al contar los contactos activos" });
  }
};

module.exports = {
  createContacto,
  getContactos,
  updateContactoState,
  countActiveContactos,
  getContactoById,
  updateContactoUsuario,
};
