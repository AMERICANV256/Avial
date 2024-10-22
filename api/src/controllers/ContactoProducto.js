const { ContactoProducto, Productos, Usuarios } = require("../db.js");
const sendEmailWithTemplate = require("../mailer/sendEmailWithTemplate");

const createContactoProducto = async (req, res) => {
  try {
    const {
      idProducto,
      nombre,
      apellido,
      razonSocial,
      email,
      telefonoCelular,
      direccion,
      pagoContado,
      cuotas,
      anticipo,
      moneda,
    } = req.body;

    // Verificar que los parámetros obligatorios están presentes
    if (
      !idProducto ||
      !nombre ||
      !apellido ||
      !razonSocial ||
      !email ||
      !telefonoCelular
    ) {
      return res.status(400).json({
        error: "Faltan parámetros obligatorios en el cuerpo de la solicitud",
      });
    }

    // Crear el nuevo contacto
    const nuevoContacto = await ContactoProducto.create({
      idProducto,
      nombre,
      apellido,
      razonSocial,
      email,
      telefonoCelular,
      direccion,
      pagoContado,
      cuotas,
      anticipo,
      moneda,
    });

    await sendEmailWithTemplate(email, "Contacto");

    return res.status(201).json(nuevoContacto);
  } catch (error) {
    console.error("Error al crear el contacto de producto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getContactoProducto = async (req, res) => {
  try {
    const contactos = await ContactoProducto.findAll({
      include: [
        {
          model: Productos,
          attributes: ["familia", "marca", "modelo"],
        },
        {
          model: Usuarios,
          attributes: ["email", "nombre", "apellido"],
        },
      ],

      order: [["fechaDeRegistro", "DESC"]],
    });

    return res.status(200).json(contactos);
  } catch (error) {
    console.error("Error al obtener los contactos de producto:", error);
    return res.status(400).send("Error al obtener los contactos de producto");
  }
};

const getContactoProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("Se requiere el ID del contacto");
    }

    const contacto = await ContactoProducto.findByPk(id, {
      include: [
        {
          model: Productos,
          attributes: ["familia", "marca", "modelo"],
        },
        {
          model: Usuarios,
          attributes: ["email", "nombre", "apellido"],
        },
      ],
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

const updateContactoProductoUsuario = async (req, res) => {
  try {
    const { idContactoProducto, idUsuario } = req.body;

    if (!idContactoProducto || !idUsuario) {
      throw "Se requieren el ID del contactoProducto y el ID del usuario";
    }

    const contacto = await ContactoProducto.findByPk(idContactoProducto);

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

module.exports = {
  createContactoProducto,
  getContactoProductoById,
  getContactoProducto,
  updateContactoProductoUsuario,
};
