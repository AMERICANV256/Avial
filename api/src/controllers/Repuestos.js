const { Repuestos, Usuarios } = require("../db.js");
const sendEmailWithTemplate = require("../mailer/sendEmailWithTemplate");

const createRepuesto = async (req, res) => {
  try {
    const { nombre, apellidos, email, telefono, direccion, repuesto } =
      req.body;

    if (
      !nombre ||
      !apellidos ||
      !email ||
      !telefono ||
      !direccion ||
      !repuesto
    ) {
      throw "Faltan parámetros en el cuerpo de la solicitud";
    }

    // Crea un nuevo contacto en la base de datos
    const nuevoRepuesto = await Repuestos.create({
      nombre,
      apellidos,
      email,
      telefono,
      direccion,
      repuesto,
    });

    await sendEmailWithTemplate(email, "Contacto");

    // Devuelve el contacto creado
    return res.status(201).json(nuevoRepuesto);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

const getRepuestos = async (req, res) => {
  try {
    const repuestos = await Repuestos.findAll({
      include: {
        model: Usuarios,
        attributes: ["email", "nombre", "apellido"],
      },
      order: [["createdAt", "DESC"]],
    });

    if (!repuestos || repuestos.length === 0) {
      return res.status(404).send("No hay contactos");
    }

    return res.status(200).json(repuestos);
  } catch (error) {
    console.error("Error al obtener los contactos:", error);
    return res.status(400).send(error);
  }
};

const getRepuestoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("Se requiere el ID del repuesto");
    }

    const repuesto = await Repuestos.findByPk(id, {
      include: {
        model: Usuarios,
        attributes: ["email", "nombre", "apellido"],
      },
    });

    if (!repuesto) {
      return res.status(404).send("Repuesto no encontrado");
    }

    return res.status(200).json(repuesto);
  } catch (error) {
    console.error("Error al obtener el Repuesto:", error);
    return res.status(500).send("Error al obtener el Repuesto");
  }
};

const updateRepuestoUsuario = async (req, res) => {
  try {
    const { idRepuesto, idUsuario } = req.body;

    if (!idRepuesto || !idRepuesto) {
      throw "Se requieren el ID del Repuesto y el ID del usuario";
    }

    const repuesto = await Repuestos.findByPk(idRepuesto);

    if (!repuesto) {
      throw "Repuesto no encontrado";
    }

    await repuesto.update({ idUsuario });

    return res.status(200).json({ repuesto });
  } catch (error) {
    console.error("Error al actualizar el usuario del repuesto:", error);
    return res
      .status(400)
      .json({ error: "Error al actualizar el usuario del repuesto" });
  }
};

module.exports = {
  createRepuesto,
  getRepuestos,
  getRepuestoById,
  updateRepuestoUsuario,
};
