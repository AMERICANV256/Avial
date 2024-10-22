const { Clientes } = require("../db.js");
const { Usuarios } = require("../db.js");
const { JWTSECRET } = process.env;
const jwt = require("../services/jwt.js");
const { Op } = require("sequelize");
const { conn } = require("../db.js");

const createCliente = async (req, res) => {
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
    if (
      !idUsuario ||
      !req.body?.CUIT ||
      !req.body?.nombre ||
      !req.body?.apellido ||
      !req.body?.mail ||
      !req.body?.telefono
    )
      throw "Faltan parámetros en el cuerpo de la solicitud";

    const generateNewId = async () => {
      const maxId = await Clientes.max("id");
      const newId = maxId ? maxId + 1 : 1;
      return newId;
    };

    let id = await generateNewId();

    let nuevoCliente = await Clientes.create({ id, ...req.body, idUsuario });

    return res.status(201).send(nuevoCliente);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

//TRAE TODOS LOS CLIENTES SI EL USUARIO ES ADMIN, SINO SOLO LOS CLIENTES QUE CARGO ESE USUARIO //

const getClientesPorIdDeUsuario = async (req, res) => {
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

    // Busca el usuario en la base de datos
    const usuario = await Usuarios.findByPk(idUsuario);

    if (!usuario) {
      throw "Usuario no encontrado";
    }

    // Fecha límite: 3 meses atrás desde hoy
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

    let clientes;

    if (usuario.rol === true) {
      // Administrador: Ver todos los clientes
      clientes = await Clientes.findAll({
        attributes: [
          "id",
          "nombre",
          "apellido",
          "mail",
          "fechaDeCreacion",
          "CUIT",
          "razonSocial",
          "telefono",
          "provincia",
          "ciudad",
          "contactoAlternativo",
          "telefonoAlternativo",
          "mailAlternativo",
          "contactoAlternativo1",
          "telefonoAlternativo1",
          "mailAlternativo1",
        ],
        order: [["apellido", "ASC"]],
      });
    } else {
      // Vendedor: Ver clientes a los que les haya creado, modificado una cotización o realizado una venta
      clientes = await Clientes.findAll({
        where: {
          id: {
            [Op.in]: conn.literal(
              `(SELECT "idCliente" FROM "Cotizaciones"
                WHERE "idUsuario" = '${idUsuario}'
                AND (
                  "fechaDeCreacion" > '${tresMesesAtras.toISOString()}' OR 
                  "fechaModi" > '${tresMesesAtras.toISOString()}' OR 
                  "fechaVenta" > '${tresMesesAtras.toISOString()}'
                ))`
            ),
          },
        },
        attributes: [
          "id",
          "nombre",
          "apellido",
          "mail",
          "fechaDeCreacion",
          "CUIT",
          "razonSocial",
          "telefono",
          "provincia",
          "ciudad",
          "contactoAlternativo",
          "telefonoAlternativo",
          "mailAlternativo",
          "contactoAlternativo1",
          "telefonoAlternativo1",
          "mailAlternativo1",
        ],
        order: [["apellido", "ASC"]],
      });
    }

    // Devuelve los clientes encontrados
    return res.status(200).json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return res.status(400).send(error);
  }
};

const getClientePorId = async (req, res) => {
  try {
    // Verifica si se proporciona el ID del cliente desde los parámetros de la ruta
    if (!req.params.idCliente) {
      throw "Se requiere el ID de cliente";
    }

    const idCliente = req.params.idCliente;

    const cliente = await Clientes.findByPk(idCliente, {
      include: [
        {
          model: Usuarios,
          attributes: ["nombre", "apellido"],
        },
      ],
    });

    if (!cliente) {
      throw "Cliente no encontrado";
    }

    return res.status(200).json(cliente);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    return res.status(400).send(error);
  }
};

// MODIFICACION DE LOS DATOS DEL CLIENTE //

const updateCliente = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ error: "Token no proporcionado" });
    }

    // Decodifica el token para obtener el idUsuario
    const decodedToken = jwt.decodeToken(
      token.replace("Bearer ", ""),
      JWTSECRET
    );
    const idUsuario = decodedToken.id;

    if (!idUsuario) {
      return res.status(401).send({ error: "Token inválido" });
    }

    // Verifica si el cuerpo de la solicitud contiene el id del cliente
    const {
      id,
      CUIT,
      domicilio,
      razonSocial,
      nombre,
      apellido,
      mail,
      telefono,
      provincia,
      ciudad,
      contactoAlternativo,
      contactoAlternativo1,
      mailAlternativo,
      mailAlternativo1,
      telefonoAlternativo,
      telefonoAlternativo1,
    } = req.body;

    if (!id) {
      throw "Se requiere el ID del cliente";
    }

    // Verifica que al menos uno de los campos para actualizar esté presente en el cuerpo de la solicitud
    if (!CUIT && !domicilio && !nombre && !apellido && !mail && !telefono) {
      throw "No hay parámetros para actualizar";
    }

    // Busca el cliente por ID
    let cliente = await Clientes.findByPk(id);

    if (!cliente) {
      return res.status(404).send("Cliente no encontrado");
    }

    // Actualiza los campos del cliente
    await cliente.update({
      CUIT: CUIT ?? cliente.CUIT,
      domicilio: domicilio ?? cliente.domicilio,
      nombre: nombre ?? cliente.nombre,
      razonSocial: razonSocial ?? cliente.razonSocial,
      apellido: apellido ?? cliente.apellido,
      mail: mail ?? cliente.mail,
      mailAlternativo: mailAlternativo ?? cliente.mailAlternativo,
      mailAlternativo1: mailAlternativo1 ?? cliente.mailAlternativo1,
      telefono: telefono ?? cliente.telefono,
      provincia: provincia ?? cliente.provincia,
      ciudad: ciudad ?? cliente.ciudad,
      telefonoAlternativo: telefonoAlternativo ?? cliente.telefonoAlternativo,
      telefonoAlternativo1:
        telefonoAlternativo1 ?? cliente.telefonoAlternativo1,
      contactoAlternativo: contactoAlternativo ?? cliente.contactoAlternativo,
      contactoAlternativo1:
        contactoAlternativo1 ?? cliente.contactoAlternativo1,
      fechaModi: new Date(),
    });

    return res.status(200).send(cliente);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

const getClientesParaCotizar = async (req, res) => {
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

    const usuario = await Usuarios.findByPk(idUsuario, { attributes: ["rol"] });

    if (!usuario) {
      throw "Usuario no encontrado";
    }

    // Fecha límite: 3 meses atrás desde hoy
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

    let clientes;

    if (usuario.rol === true) {
      // Administrador: Ver todos los clientes
      clientes = await Clientes.findAll({
        attributes: ["id", "nombre", "apellido", "mail", "CUIT"],
      });
    } else {
      // Vendedor: Ver clientes exclusivos y aquellos sin cotizaciones recientes
      clientes = await Clientes.findAll({
        where: {
          [Op.or]: [
            // Clientes a los que el usuario ha realizado una cotización en los últimos 3 meses
            {
              id: {
                [Op.in]: conn.literal(
                  `(SELECT "idCliente" FROM "Cotizaciones"
                  WHERE "idUsuario" = '${idUsuario}' 
                  AND (
                    "fechaDeCreacion" > '${tresMesesAtras.toISOString()}' OR 
                    "fechaModi" > '${tresMesesAtras.toISOString()}' OR 
                    "fechaVenta" > '${tresMesesAtras.toISOString()}'
                  ))`
                ),
              },
            },
            // Clientes que no tienen cotizaciones recientes (más de 3 meses) y no están asociados a otros usuarios
            {
              id: {
                [Op.notIn]: conn.literal(
                  `(SELECT "idCliente" FROM "Cotizaciones"
                  WHERE (
                    "fechaDeCreacion" > '${tresMesesAtras.toISOString()}' OR 
                    "fechaModi" > '${tresMesesAtras.toISOString()}' OR 
                    "fechaVenta" > '${tresMesesAtras.toISOString()}'
                  ))`
                ),
              },
            },
          ],
        },
        attributes: ["id", "nombre", "apellido", "mail", "CUIT"],
      });
    }

    res.json(clientes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener los clientes para cotizar" });
  }
};
const getMailsPorIdDeUsuario = async (req, res) => {
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

    // Busca el usuario en la base de datos
    const usuario = await Usuarios.findByPk(idUsuario);

    if (!usuario) {
      throw "Usuario no encontrado";
    }

    // Fecha límite: 3 meses atrás desde hoy
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

    let emails;

    if (usuario.rol === true) {
      // Administrador: Ver todos los emails
      emails = await Clientes.findAll({
        attributes: [
          "nombre",
          "apellido",
          "mail",
          "mailAlternativo",
          "mailAlternativo1",
        ],
        order: [["apellido", "ASC"]],
      });
    } else {
      // Vendedor: Ver emails de clientes a los que les haya creado, modificado una cotización o realizado una venta
      emails = await Clientes.findAll({
        where: {
          id: {
            [Op.in]: conn.literal(
              `(SELECT "idCliente" FROM "Cotizaciones"
                WHERE "idUsuario" = '${idUsuario}'
                AND (
                  "fechaDeCreacion" > '${tresMesesAtras.toISOString()}' OR 
                  "fechaModi" > '${tresMesesAtras.toISOString()}' OR 
                  "fechaVenta" > '${tresMesesAtras.toISOString()}'
                ))`
            ),
          },
        },
        attributes: [
          "nombre",
          "apellido",
          "mail",
          "mailAlternativo",
          "mailAlternativo1",
        ],
        order: [["apellido", "ASC"]],
      });
    }

    // Devuelve los emails encontrados
    return res.status(200).json(emails);
  } catch (error) {
    console.error("Error al obtener emails:", error);
    return res.status(400).send(error);
  }
};

module.exports = {
  createCliente,
  getClientesPorIdDeUsuario,
  updateCliente,
  getClientesParaCotizar,
  getClientePorId,
  getMailsPorIdDeUsuario,
};
