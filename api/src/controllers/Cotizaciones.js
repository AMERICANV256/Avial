const { Cotizaciones } = require("../db.js");
const { Usuarios } = require("../db.js");
const { Clientes } = require("../db.js");
const { CotizacionIndividual } = require("../db.js");
const { Productos } = require("../db.js");
const { HistorialCotizacion } = require("../db.js");
const { conn } = require("../db.js");
const { Op } = require("sequelize");
const { JWTSECRET } = process.env;
const jwt = require("../services/jwt.js");

// FUNCION PARA CREAR UNA COTIZACION //
const createCotizacion = async (req, res) => {
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
    const {
      idCliente,
      idProducto,
      IVA,
      moneda,
      PrecioFinal,
      precio,
      anticipo,
      saldoAFinanciar,
      interes,
      saldo,
      saldoConInteres,
      cuotas,
      cuotaValor,
      notasEmail,
      notasUsuario,
      plazoEntrega,
      formaPago,
      mantenimientoOferta,
      lugarEntrega,
      garantia,
      entregaTecnica,
      origenFabricacion,
      patentamiento,
      cantidadProducto,
      cotizacionesIndividuales,
    } = req.body;

    if (!idUsuario || !idCliente || !idProducto) {
      throw "Faltan parámetros en el cuerpo de la solicitud";
    }

    // Obtener el código del usuario
    const usuario = await Usuarios.findOne({
      where: { id: idUsuario },
      attributes: ["nombre", "apellido", "codigo"],
    });

    if (!usuario) {
      throw "Usuario no encontrado";
    }

    // Generar el nuevo ID para la cotización
    const generateNewId = async () => {
      const maxId = await Cotizaciones.max("id");
      const newId = maxId ? maxId + 1 : 1;
      return newId;
    };

    let id = await generateNewId();

    // Formatear idUsuario y idCotizacion para numeroCotizacion
    const formattedIdUsuario = String(idUsuario).slice(0, 5);
    const formattedIdCotizacion = String(id);

    // Crear numeroCotizacion y codigoCotizacion
    const numeroCotizacion = `${formattedIdUsuario} - ${formattedIdCotizacion}`;
    const codigoCotizacion = `${usuario.codigo} - ${String(id).padStart(
      3,
      "0"
    )}`;

    // Crear la nueva cotización en la tabla Cotizaciones
    let nuevaCotizacion = await Cotizaciones.create({
      id,
      idUsuario,
      idCliente,
      idProducto,
      numeroCotizacion,
      codigoCotizacion,
      precio,
      anticipo,
      saldoAFinanciar,
      IVA,
      moneda,
      interes,
      saldo,
      cuotas,
      cuotaValor,
      saldoConInteres,
      PrecioFinal,
      estado: 1,
      notasEmail,
      notasUsuario,
      plazoEntrega,
      formaPago,
      mantenimientoOferta,
      lugarEntrega,
      garantia,
      cantidadProducto,
      entregaTecnica,
      origenFabricacion,
      patentamiento,
      fechaDeCreacion: new Date(),
      fechaModi: null,
      fechaVenta: null,
    });

    // Crear los detalles en CotizacionIndividual utilizando el mismo idCotizacion
    if (cotizacionesIndividuales && cotizacionesIndividuales.length > 0) {
      const cotizacionesIndividualesConId = cotizacionesIndividuales.map(
        (cotizacion) => ({
          idCotizacion: nuevaCotizacion.id,
          ...cotizacion,
        })
      );

      // Insertamos todas las cotizaciones individuales en batch
      await CotizacionIndividual.bulkCreate(cotizacionesIndividualesConId);
    }

    const cliente = await Clientes.findOne({
      where: { id: idCliente },
      attributes: ["nombre", "apellido", "mail"],
    });

    const producto = await Productos.findOne({
      where: { id: idProducto },
      attributes: ["familia", "marca", "modelo"],
    });

    for (const cotizacion of cotizacionesIndividuales) {
      await HistorialCotizacion.create({
        numeroCotizacion: nuevaCotizacion.numeroCotizacion,
        precio: cotizacion.precio || null,
        anticipo: cotizacion.anticipo || null,
        saldoAFinanciar: cotizacion.saldoAFinanciar || null,
        IVA: cotizacion.IVA || null,
        moneda: cotizacion.moneda || null,
        interes: cotizacion.interes || null,
        saldo: cotizacion.saldo || null,
        cuotas: cotizacion.cuotas || null,
        cuotaValor: cotizacion.cuotaValor || null,
        saldoConInteres: cotizacion.saldoConInteres || null,
        PrecioFinal: cotizacion.PrecioFinal || null,
        codigoCotizacion: nuevaCotizacion.codigoCotizacion,
        fechaDeCreacion: nuevaCotizacion.fechaDeCreacion,
        fechaModi: nuevaCotizacion.fechaModi,
        nombreCliente: cliente.nombre || "",
        apellidoCliente: cliente.apellido || "",
        mailCliente: cliente.mail || "",
        familia: producto.familia || "",
        marca: producto.marca || "",
        modelo: producto.modelo || "",
        estado: nuevaCotizacion.estado,
        apellidoVendedor: usuario.apellido || "",
        nombreVendedor: usuario.nombre || "",
        codigo: usuario.codigo || "",
        notasUsuario: notasUsuario || "",
        fechaDeCreacion: new Date(),
      });
    }

    if (!cliente || !producto) {
      throw "No se pudieron obtener los datos del cliente o del producto";
    }

    return res.status(201).send(nuevaCotizacion);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

// GUARDAR URL DEL PDF //

const updateCotizacionPdf = async (req, res) => {
  try {
    const { id, CotizacionPDF } = req.body;

    if (!id || !CotizacionPDF) {
      throw "Faltan parámetros en el cuerpo de la solicitud";
    }

    // Verificar si la cotización existe
    const cotizacion = await Cotizaciones.findOne({
      where: { id: id },
    });

    if (!cotizacion) {
      throw "Cotización no encontrada";
    }

    cotizacion.CotizacionPDF = CotizacionPDF;

    await cotizacion.save();

    return res.status(200).send(cotizacion);
  } catch (error) {
    return res.status(400).send({ error: error.toString() });
  }
};

//TRAE TODOS LAS COTIZACIONES SI EL USUARIO ES ADMIN, SINO SOLO LAS COTIZACIONES QUE CARGO ESE USUARIO //

const getCotizaciones = async (req, res) => {
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

    const usuario = await Usuarios.findByPk(idUsuario);
    if (!usuario) {
      throw "Usuario no encontrado";
    }

    let whereCondition = { estado: 1 };

    if (usuario.rol === false && !usuario.baneado) {
      // Si es vendedor, solo ve sus cotizaciones
      whereCondition.idUsuario = idUsuario;
    } else if (
      usuario.rol === true ||
      (usuario.rol === false && usuario.baneado === true)
    ) {
      // Si es administrador o gerente (ven todas las cotizaciones)
    } else {
      return res
        .status(403)
        .send({ error: "No tienes permisos para acceder a esta información" });
    }

    const cotizaciones = await Cotizaciones.findAll({
      where: whereCondition,
      attributes: [
        "id",
        "numeroCotizacion",
        "fechaDeCreacion",
        "codigoCotizacion",
      ],
      include: [
        {
          model: Usuarios,
          attributes: ["nombre", "apellido", "email"],
        },
        {
          model: Clientes,
          attributes: ["nombre", "apellido", "mail"],
        },
        {
          model: Productos,
          attributes: ["familia", "marca", "modelo"],
        },
        {
          model: CotizacionIndividual,
          attributes: [
            "precio",
            "cuotas",
            "cuotaValor",
            "saldoAFinanciar",
            "interes",
            "PrecioFinal",
            "fechaDeCreacion",
            "anticipo",
          ],
        },
      ],
      order: [["fechaDeCreacion", "DESC"]],
    });

    return res.status(200).json(cotizaciones);
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error);
    return res.status(400).send(error);
  }
};

// DETALLE DE LA COTIZACION POR ID DE COTI //

const getCotizacionDetalle = async (req, res) => {
  try {
    // Verificar si se proporciona el ID de cotización desde los parámetros de la ruta
    const idCotizacion = req.params.idCotizacion;
    if (!idCotizacion) {
      return res.status(400).send({ error: "Se requiere el ID de cotización" });
    }

    // Buscar la cotización en la base de datos
    const cotizacion = await Cotizaciones.findByPk(idCotizacion, {
      include: [
        {
          model: Usuarios,
          attributes: ["nombre", "apellido", "email"],
        },
        {
          model: Clientes,
          attributes: [
            "razonSocial",
            "CUIT",
            "apellido",
            "mail",
            "mailAlternativo",
            "mailAlternativo1",
            "nombre",
          ],
        },
        {
          model: Productos,
          attributes: [
            "division",
            "familia",
            "marca",
            "modelo",
            "motor",
            "caracteristicasGenerales",
            "motoresdeTraslacionyZapatas",
            "sistemaHidraulico",
            "capacidades",
            "Cabina",
            "dimensionesGenerales",
            "imagen",
            "imagen1",
            "imagen2",
            "imagen3",
          ],
        },
        {
          model: CotizacionIndividual,
          attributes: [
            "id",
            "precio",
            "precioEnPesos",
            "PrecioFinalEnPesos",
            "cotizacionDolar",
            "cuotaValorEnPesos",
            "anticipoPorcentaje",
            "anticipo",
            "saldoAFinanciar",
            "IVA",
            "moneda",
            "interes",
            "cuotas",
            "cuotaValor",
            "saldoConInteres",
            "PrecioFinal",
            "cantidadProducto",
            "estado",
          ],
        },
      ],
    });

    // Verificar si se encontró la cotización
    if (!cotizacion) {
      return res.status(404).send({ error: "Cotización no encontrada" });
    }

    // Estructurar los datos para la respuesta
    const respuesta = {
      idCotizacion: cotizacion.id,
      idUsuario: cotizacion.idUsuario,
      idCliente: cotizacion.idCliente,
      idProducto: cotizacion.idProducto,
      IVA: cotizacion.IVA,
      moneda: cotizacion.moneda,
      PrecioFinal: cotizacion.PrecioFinal,
      precio: cotizacion.precio,
      anticipo: cotizacion.anticipo,
      saldoAFinanciar: cotizacion.saldoAFinanciar,
      interes: cotizacion.interes,
      saldo: cotizacion.saldo,
      saldoConInteres: cotizacion.saldoConInteres,
      cuotas: cotizacion.cuotas,
      cuotaValor: cotizacion.cuotaValor,
      notasEmail: cotizacion.notasEmail,
      notasUsuario: cotizacion.notasUsuario,
      numeroCotizacion: cotizacion.numeroCotizacion,
      codigoCotizacion: cotizacion.codigoCotizacion,
      plazoEntrega: cotizacion.plazoEntrega,
      formaPago: cotizacion.formaPago,
      mantenimientoOferta: cotizacion.mantenimientoOferta,
      lugarEntrega: cotizacion.lugarEntrega,
      garantia: cotizacion.garantia,
      entregaTecnica: cotizacion.entregaTecnica,
      origenFabricacion: cotizacion.origenFabricacion,
      patentamiento: cotizacion.patentamiento,
      estado: cotizacion.estado,
      fechaDeCreacion: cotizacion.fechaDeCreacion,
      fechaModi: cotizacion.fechaModi,
      fechaVenta: cotizacion.fechaVenta,
      CotizacionPDF: cotizacion.CotizacionPDF,
      cotizacionesIndividuales: cotizacion.CotizacionIndividuals || [],
      cliente: {
        razonSocial: cotizacion.Cliente.razonSocial,
        CUIT: cotizacion.Cliente.CUIT,
        email: cotizacion.Cliente.mail,
        apellido: cotizacion.Cliente.apellido,
        mailAlternativo: cotizacion.Cliente.mailAlternativo,
        mailAlternativo1: cotizacion.Cliente.mailAlternativo1,
        nombre: cotizacion.Cliente.nombre,
      },
      usuario: {
        nombre: cotizacion.Usuario.nombre,
        apellido: cotizacion.Usuario.apellido,
        email: cotizacion.Usuario.email,
      },
      producto: {
        division: cotizacion.Producto.division,
        familia: cotizacion.Producto.familia,
        marca: cotizacion.Producto.marca,
        modelo: cotizacion.Producto.modelo,
        motor: cotizacion.Producto.motor,
        caracteristicasGenerales: cotizacion.Producto.caracteristicasGenerales,
        motoresdeTraslacionyZapatas:
          cotizacion.Producto.motoresdeTraslacionyZapatas,
        sistemaHidraulico: cotizacion.Producto.sistemaHidraulico,
        capacidades: cotizacion.Producto.capacidades,
        Cabina: cotizacion.Producto.Cabina,
        dimensionesGenerales: cotizacion.Producto.dimensionesGenerales,
        imagen: cotizacion.Producto.imagen,
        imagen1: cotizacion.Producto.imagen1,
        imagen2: cotizacion.Producto.imagen2,
        imagen3: cotizacion.Producto.imagen3,
      },
    };

    // Devolver la cotización completa
    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error al obtener detalle de cotización:", error);
    return res.status(400).send({
      error: error.message || "Error al obtener detalle de cotización",
    });
  }
};

// SOLO LO VE EL ADMINISTRADOR //

// FUNCION QUE MUESTRA LA CANTIDAD DE COTIZACIONES DEL VENDEDOR//

const getCantidadCotizacionesPorUsuario = async (req, res) => {
  try {
    // Consulta para contar la cantidad de cotizaciones por usuario
    const cantidadCotizacionesPorUsuario = await Cotizaciones.findAll({
      attributes: [
        [conn.fn("COUNT", conn.col("Cotizaciones.id")), "cantidadCotizaciones"],
        [conn.col("Usuario.id"), "idUsuario"],
        [conn.col("Usuario.nombre"), "nombre"],
        [conn.col("Usuario.apellido"), "apellido"],
      ],
      include: [{ model: Usuarios, attributes: [] }],
      group: ["Usuario.id"],
    });

    return res.status(200).json(cantidadCotizacionesPorUsuario);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

// FUNCION PARA MODIFICAR COTIZACIONES //

const putCotizaciones = async (req, res) => {
  try {
    // Obtener el token del encabezado
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ error: "Token no proporcionado" });
    }

    // Decodificar el token para obtener el idUsuario
    const decodedToken = jwt.decodeToken(
      token.replace("Bearer ", ""),
      JWTSECRET
    );
    const idUsuario = decodedToken.id;

    // Obtener los datos del cuerpo de la solicitud
    const {
      id,
      idCliente,
      idProducto,
      cotizacionesIndividuales,
      ...updatedFields
    } = req.body;

    // Verificar que se proporciona un ID
    if (!id) {
      return res
        .status(400)
        .send(
          "Se requiere un ID válido para actualizar o crear la cotización."
        );
    }

    // Verificar la existencia del usuario
    const usuario = await Usuarios.findOne({
      where: { id: idUsuario },
      attributes: ["nombre", "apellido", "codigo"],
    });

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // Buscar la cotización por ID
    let cotizacion = await Cotizaciones.findOne({ where: { id } });

    let cliente;
    let producto;

    if (!cotizacion) {
      // Si no se encuentra la cotización, crear una nueva
      updatedFields.idUsuario = idUsuario;
      updatedFields.fechaModi = new Date();

      // Crear la nueva cotización
      cotizacion = await Cotizaciones.create(updatedFields);

      // Verificar e insertar cotizaciones individuales
      if (cotizacionesIndividuales && cotizacionesIndividuales.length > 0) {
        const cotizacionesIndividualesConId = cotizacionesIndividuales.map(
          (cotizacionIndividual) => ({
            idCotizacion: cotizacion.id,
            fechaDeCreacion: new Date(),
            ...cotizacionIndividual,
          })
        );

        // Insertar las cotizaciones individuales en batch
        await CotizacionIndividual.bulkCreate(cotizacionesIndividualesConId);

        cliente = await Clientes.findOne({
          where: { id: idCliente },
          attributes: ["nombre", "apellido", "mail"],
        });

        if (!cliente) {
          throw new Error("Cliente no encontrado");
        }

        producto = await Productos.findOne({
          where: { id: idProducto },
          attributes: ["familia", "marca", "modelo"],
        });

        if (!producto) {
          throw new Error("Producto no encontrado");
        }

        // Crear el historial para cada cotización individual
        for (const cotizacionIndividual of cotizacionesIndividuales) {
          await HistorialCotizacion.create({
            numeroCotizacion: cotizacion.numeroCotizacion,
            precio: cotizacionIndividual.precio || null,
            anticipo: cotizacionIndividual.anticipo || null,
            saldoAFinanciar: cotizacionIndividual.saldoAFinanciar || null,
            IVA: cotizacionIndividual.IVA || null,
            moneda: cotizacionIndividual.moneda || null,
            interes: cotizacionIndividual.interes || null,
            saldo: cotizacionIndividual.saldo || null,
            cuotas: cotizacionIndividual.cuotas || null,
            cuotaValor: cotizacionIndividual.cuotaValor || null,
            saldoConInteres: cotizacionIndividual.saldoConInteres || null,
            PrecioFinal: cotizacionIndividual.PrecioFinal || null,
            codigoCotizacion: cotizacion.codigoCotizacion,
            fechaDeCreacion: cotizacion.fechaDeCreacion,
            fechaModi: cotizacion.fechaModi,
            nombreCliente: cliente.nombre || "",
            apellidoCliente: cliente.apellido || "",
            mailCliente: cliente.mail || "",
            familia: producto.familia || "",
            marca: producto.marca || "",
            modelo: producto.modelo || "",
            estado: cotizacion.estado,
            apellidoVendedor: usuario.apellido || "",
            nombreVendedor: usuario.nombre || "",
            codigo: usuario.codigo || "",
            notasUsuario: updatedFields.notasUsuario || "",
            fechaDeCreacion: new Date(),
          });
        }
      }

      return res.status(201).send(cotizacion);
    }

    // Si se encuentra la cotización, actualizarla
    if (updatedFields.idUsuario) {
      updatedFields.idUsuario = idUsuario;
    }

    updatedFields.fechaModi = new Date();

    await cotizacion.update(updatedFields);

    // Recuperar las cotizaciones individuales actuales
    const cotizacionesActuales = await CotizacionIndividual.findAll({
      where: { idCotizacion: id },
    });

    // Convertir a un mapa por id para comparación
    const cotizacionesActualesMap = new Map(
      cotizacionesActuales.map((item) => [item.id, item])
    );

    // Identificar cambios
    const cotizacionesIndividualesConId = cotizacionesIndividuales.map(
      (cotizacionIndividual) => ({
        idCotizacion: cotizacion.id,
        ...cotizacionIndividual,
      })
    );

    // Filtrar las cotizaciones individuales que deben ser eliminadas
    const cotizacionesAEliminar = cotizacionesActuales.filter(
      (actual) =>
        !cotizacionesIndividualesConId.some((nueva) => nueva.id === actual.id)
    );

    if (cotizacionesAEliminar.length > 0) {
      // Eliminar las cotizaciones individuales que no están en la lista de actualización
      await CotizacionIndividual.destroy({
        where: { id: cotizacionesAEliminar.map((c) => c.id) },
      });
    }

    // Filtrar las cotizaciones individuales que deben ser actualizadas o agregadas
    const cotizacionesAActualizar = cotizacionesIndividualesConId.filter(
      (nueva) => {
        const actual = cotizacionesActualesMap.get(nueva.id);
        if (!actual) return true; // Si es nueva, siempre se debe guardar
        return !(
          actual.precio === nueva.precio &&
          actual.precioEnPesos === nueva.precioEnPesos &&
          actual.PrecioFinalEnPesos === nueva.PrecioFinalEnPesos &&
          actual.cuotaValorEnPesos === nueva.cuotaValorEnPesos &&
          actual.anticipoPorcentaje === nueva.anticipoPorcentaje &&
          actual.cotizacionDolar === nueva.cotizacionDolar &&
          actual.anticipo === nueva.anticipo &&
          actual.saldoAFinanciar === nueva.saldoAFinanciar &&
          actual.IVA === nueva.IVA &&
          actual.moneda === nueva.moneda &&
          actual.interes === nueva.interes &&
          actual.saldo === nueva.saldo &&
          actual.cuotas === nueva.cuotas &&
          actual.cuotaValor === nueva.cuotaValor &&
          actual.saldoConInteres === nueva.saldoConInteres &&
          actual.PrecioFinal === nueva.PrecioFinal
        );
      }
    );

    if (cotizacionesAActualizar.length > 0) {
      // Crear o actualizar cotizaciones individuales
      await CotizacionIndividual.bulkCreate(cotizacionesAActualizar, {
        updateOnDuplicate: [
          "precio",
          "precioEnPesos",
          "cotizacionDolar",
          "anticipoPorcentaje",
          "cuotaValorEnPesos",
          "PrecioFinalEnPesos",
          "anticipo",
          "saldoAFinanciar",
          "IVA",
          "moneda",
          "interes",
          "saldo",
          "cuotas",
          "cuotaValor",
          "saldoConInteres",
          "PrecioFinal",
        ],
      });

      // Si no se ha definido previamente, obtener cliente y producto
      if (!cliente) {
        cliente = await Clientes.findOne({
          where: { id: idCliente },
          attributes: ["nombre", "apellido", "mail"],
        });

        if (!cliente) {
          throw new Error("Cliente no encontrado");
        }
      }

      if (!producto) {
        producto = await Productos.findOne({
          where: { id: idProducto },
          attributes: ["familia", "marca", "modelo"],
        });

        if (!producto) {
          throw new Error("Producto no encontrado");
        }
      }

      // Crear el historial para las cotizaciones individuales modificadas
      for (const cotizacionIndividual of cotizacionesAActualizar) {
        await HistorialCotizacion.create({
          numeroCotizacion: cotizacion.numeroCotizacion,
          precio: cotizacionIndividual.precio || null,
          anticipo: cotizacionIndividual.anticipo || null,
          saldoAFinanciar: cotizacionIndividual.saldoAFinanciar || null,
          IVA: cotizacionIndividual.IVA || null,
          moneda: cotizacionIndividual.moneda || null,
          interes: cotizacionIndividual.interes || null,
          saldo: cotizacionIndividual.saldo || null,
          cuotas: cotizacionIndividual.cuotas || null,
          cuotaValor: cotizacionIndividual.cuotaValor || null,
          saldoConInteres: cotizacionIndividual.saldoConInteres || null,
          PrecioFinal: cotizacionIndividual.PrecioFinal || null,
          codigoCotizacion: cotizacion.codigoCotizacion,
          fechaModi: cotizacion.fechaModi,
          nombreCliente: cliente.nombre || "",
          apellidoCliente: cliente.apellido || "",
          mailCliente: cliente.mail || "",
          familia: producto.familia || "",
          marca: producto.marca || "",
          modelo: producto.modelo || "",
          estado: cotizacion.estado,
          apellidoVendedor: usuario.apellido || "",
          nombreVendedor: usuario.nombre || "",
          codigo: usuario.codigo || "",
          notasUsuario: updatedFields.notasUsuario || "",
          fechaDeCreacion: new Date(),
        });
      }
    }

    return res.status(200).send(cotizacion);
  } catch (error) {
    console.error("Error en putCotizaciones:", error.message);
    return res.status(500).send({ error: error.message });
  }
};

//SETEAR EL ESTADO EN 2 (ESTO QUIERE DECIR QUE LA COTIZACION SE CONCRETO) //
//VENTAS//

const updateCotizacionEstado = async (req, res) => {
  try {
    if (!req.body?.id) {
      throw "Se requiere el ID de la cotización";
    }

    const { id } = req.body;

    let cotizacion = await Cotizaciones.findByPk(id);

    if (!cotizacion) {
      throw "Cotización no encontrada";
    }

    const cliente = await Clientes.findOne({
      where: { id: cotizacion.idCliente },
      attributes: ["nombre", "apellido", "mail"],
    });

    const usuario = await Usuarios.findOne({
      where: { id: cotizacion.idUsuario },
      attributes: ["nombre", "apellido"],
    });

    // Obtener datos del producto
    const producto = await Productos.findOne({
      where: { id: cotizacion.idProducto },
      attributes: ["familia", "marca", "modelo"],
    });

    if (!cliente || !producto) {
      throw "No se pudieron obtener los datos del cliente o del producto";
    }

    await cotizacion.update({ estado: 2, fechaVenta: new Date() });

    await HistorialCotizacion.create({
      numeroCotizacion: cotizacion.numeroCotizacion,
      precio: cotizacion.precio,
      anticipo: cotizacion.anticipo,
      saldoAFinanciar: cotizacion.saldoAFinanciar,
      IVA: cotizacion.IVA,
      cuotas: cotizacion.cuotas,
      cuotaValor: cotizacion.cuotaValor,
      moneda: cotizacion.moneda,
      interes: cotizacion.interes,
      saldo: cotizacion.saldo,
      codigoCotizacion: cotizacion.codigoCotizacion,
      saldoConInteres: cotizacion.saldoConInteres,
      PrecioFinal: cotizacion.PrecioFinal,
      estado: cotizacion.estado,
      fechaDeCreacion: cotizacion.fechaDeCreacion,
      nombreCliente: cliente.nombre,
      apellidoCliente: cliente.apellido,
      mailCliente: cliente.mail,
      familia: producto.familia,
      marca: producto.marca,
      modelo: producto.modelo,
      fechaModi: new Date(),
      apellidoVendedor: usuario.apellido,
      nombreVendedor: usuario.nombre,
      fechaDeCreacion: new Date(),
    });

    return res.status(200).send("La cotización se concretó con éxito.");
  } catch (error) {
    console.error(error);
    return res.status(400).send(error.toString());
  }
};

// SUMA EL PRECIO FINAL DE TODAS LAS COTIZACIONES DISCRIMINADO EN PESOS Y DOLARES //

const sumarPreciosFinales = async (req, res) => {
  try {
    const sumaPreciosFinalesUSD = await cotizacionesIndividuales.sum(
      "PrecioFinal",
      {
        where: { moneda: "USD" },
      }
    );

    const sumaPreciosFinalesARS = await Cotizaciones.sum("PrecioFinal", {
      where: { moneda: "$" },
    });

    return res.status(200).json({
      sumaPreciosFinalesUSD,
      sumaPreciosFinalesARS,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

//ESTA FUNCION SUMA LAS VENTAS TOTALES, LE TRAE EL TOTAL AL ADMIN, Y EL TOTAL DE SUS VENTAS AL VENDEDOR //

const sumarPreciosFinalesPorMonedaYEstado = async (req, res) => {
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
    const usuario = await Usuarios.findByPk(idUsuario);
    const esRolTrue = usuario.rol === true;

    let whereCondition = { estado: 2 };

    // Si el usuario no tiene rol true, limita la búsqueda a sus propias cotizaciones
    if (!esRolTrue) {
      whereCondition.idUsuario = idUsuario;
    }

    // Suma los valores de PrecioFinal para USD
    const sumaPreciosFinalesUSD = await Cotizaciones.sum("PrecioFinal", {
      where: { ...whereCondition, moneda: "USD" },
    });

    // Suma los valores de PrecioFinal para ARS
    const sumaPreciosFinalesARS = await Cotizaciones.sum("PrecioFinal", {
      where: { ...whereCondition, moneda: "$" },
    });

    return res.status(200).json({
      sumaPreciosFinalesUSD,
      sumaPreciosFinalesARS,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

// FUNCION QUE MUESTRA LAS VENTAS DE CADA USUARIO Y TODAS SI EL USUARIO ES ADMIN //

const getCotizacionesEstadoDos = async (req, res) => {
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

    const usuario = await Usuarios.findByPk(idUsuario);
    if (!usuario) {
      throw "Usuario no encontrado";
    }

    let cotizaciones;
    if (usuario.rol === true) {
      // Usuario con rol true: traer todas las cotizaciones individuales con estado 2
      cotizaciones = await CotizacionIndividual.findAll({
        where: { estado: 2 },
        attributes: [
          "id",
          "precio",
          "cuotas",
          "cuotaValor",
          "saldoAFinanciar",
          "interes",
          "PrecioFinal",
          "fechaDeCreacion",
          "fechaVenta",
        ],
        include: [
          {
            model: Cotizaciones,
            attributes: ["codigoCotizacion"],
            include: [
              { model: Usuarios, attributes: ["nombre", "apellido"] },
              { model: Clientes, attributes: ["nombre", "apellido", "mail"] },
              {
                model: Productos,
                attributes: ["familia", "marca", "modelo"],
              },
            ],
            order: [["fechaVenta", "DESC"]],
          },
        ],
      });
    } else if (usuario.rol === false) {
      // Usuario con rol false: traer solo sus cotizaciones individuales con estado 2
      cotizaciones = await CotizacionIndividual.findAll({
        where: { estado: 2 },
        attributes: [
          "id",
          "precio",
          "cuotas",
          "cuotaValor",
          "saldoAFinanciar",
          "interes",
          "PrecioFinal",
          "fechaDeCreacion",
          "fechaVenta",
        ],
        include: [
          {
            model: Cotizaciones,
            attributes: ["codigoCotizacion"],
            where: { idUsuario: usuario.id },
            include: [
              { model: Usuarios, attributes: ["nombre", "apellido"] },
              { model: Clientes, attributes: ["nombre", "apellido", "mail"] },
              {
                model: Productos,
                attributes: ["familia", "marca", "modelo"],
              },
            ],
            order: [["fechaVenta", "DESC"]],
          },
        ],
      });
    }

    // Devolver las cotizaciones
    return res.status(200).json(cotizaciones);
  } catch (error) {
    console.error("Error al obtener cotizaciones con estado 2:", error);
    return res.status(400).send(error);
  }
};

const getCotizacionesEstadoTres = async (req, res) => {
  try {
    // Buscar cotizaciones individuales con estado 3
    const cotizaciones = await CotizacionIndividual.findAll({
      where: { estado: 3 },
      attributes: [
        "precio",
        "PrecioFinal",
        "moneda",
        "interes",
        "saldoAFinanciar",
        "cuotas",
        "cuotaValor",
        "anticipo",
        "id",
      ],
      include: [
        {
          model: Cotizaciones,
          attributes: [
            "id",
            "fechaDeCreacion",
            "numeroCotizacion",
            "codigoCotizacion",
          ],
          include: [
            { model: Usuarios, attributes: ["nombre", "apellido"] },
            { model: Clientes, attributes: ["nombre", "apellido", "mail"] },
            { model: Productos, attributes: ["familia", "marca", "modelo"] },
          ],
        },
      ],
      order: [[{ model: Cotizaciones }, "fechaVenta", "DESC"]],
    });

    // Devolver las cotizaciones individuales con estado 3
    return res.status(200).json(cotizaciones);
  } catch (error) {
    console.error(
      "Error al obtener cotizaciones individuales con estado 3:",
      error
    );
    return res.status(400).send({ error: error.message });
  }
};

const getVentaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw "Se requiere el ID de la cotización individual";
    }

    // Buscar la cotización individual por ID
    const cotizacionIndividual = await CotizacionIndividual.findByPk(id, {
      include: [
        {
          model: Cotizaciones,
          include: [
            { model: Usuarios, attributes: ["nombre", "apellido", "email"] },
            { model: Clientes, attributes: ["nombre", "apellido", "mail"] },
            { model: Productos, attributes: ["familia", "marca", "modelo"] },
          ],
        },
      ],
    });

    if (!cotizacionIndividual) {
      throw "Cotización individual no encontrada";
    }

    // Devolver la cotización
    return res.status(200).json(cotizacionIndividual);
  } catch (error) {
    console.error("Error al obtener la cotización:", error);
    return res.status(400).send(error);
  }
};

// ULTIMAS 5 COTIZACIONES PARA MOSTRAR EN EL ADMIN HOME //

const getUltimasCotizaciones = async (req, res) => {
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

    // Buscar el usuario en la base de datos
    const usuario = await Usuarios.findByPk(idUsuario);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Definir las condiciones de búsqueda
    let whereCondition = {};
    if (usuario.rol === false && !usuario.baneado) {
      whereCondition.idUsuario = idUsuario;
    } else if (
      usuario.rol === true ||
      (usuario.rol === false && usuario.baneado === true)
    ) {
    } else {
      return res
        .status(403)
        .send({ error: "No tienes permisos para acceder a esta información" });
    }

    // Obtener las últimas 5 cotizaciones
    const cotizaciones = await Cotizaciones.findAll({
      where: whereCondition,
      order: [["fechaDeCreacion", "DESC"]],
      limit: 5,
      include: [
        {
          model: Clientes,
          attributes: ["nombre", "apellido"],
        },
        {
          model: Productos,
          attributes: ["modelo"],
        },
        {
          model: CotizacionIndividual,
          attributes: ["PrecioFinal"],
        },
      ],
    });

    return res.status(200).json(cotizaciones);
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error);
    return res.status(500).json({ error: "Error al obtener cotizaciones" });
  }
};

// FUNCION PARA EL ADMIN HOME QUE MUESTRA LA  SUMATORIA DE LAS COTIZACIONES, VENTAS Y CANTIDAD TOTAL
// DE COTIZACIONES (TODAS SI ES ADMIN Y POR VENDEDOR)

const getCotizacionesSum = async (req, res) => {
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

    const usuario = await Usuarios.findByPk(idUsuario);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    let cotizacionesCotizaciones;
    let cotizacionesVentas;

    // Condiciones para obtener cotizaciones y ventas
    if (usuario.rol === true) {
      // Obtener todas las cotizaciones (estado 1) y ventas (estado 2)
      cotizacionesCotizaciones = await Cotizaciones.findAll({
        include: [
          {
            model: CotizacionIndividual,
            where: { estado: 1 },
            attributes: ["PrecioFinal", "moneda"],
          },
        ],
      });

      cotizacionesVentas = await Cotizaciones.findAll({
        include: [
          {
            model: CotizacionIndividual,
            where: { estado: 2 },
            attributes: ["PrecioFinal", "moneda"],
          },
        ],
      });
    } else {
      // Obtener solo las cotizaciones y ventas del usuario con estado filtrado
      cotizacionesCotizaciones = await Cotizaciones.findAll({
        where: { idUsuario }, // Filtrar por ID de usuario
        include: [
          {
            model: CotizacionIndividual,
            where: { estado: 1 },
            attributes: ["PrecioFinal", "moneda"],
          },
        ],
      });

      cotizacionesVentas = await Cotizaciones.findAll({
        where: { idUsuario }, // Filtrar por ID de usuario
        include: [
          {
            model: CotizacionIndividual,
            where: { estado: 2 },
            attributes: ["PrecioFinal", "moneda"],
          },
        ],
      });
    }

    const result = {
      COTIZACIONES: {
        totalPesos: 0,
        totalUSD: 0,
        CANTIDADTOTAL: 0, // Inicializado a 0
      },
      VENTAS: {
        totalPesos: 0,
        totalUSD: 0,
        CANTIDADTOTAL: 0, // Inicializado a 0
      },
    };

    // Calcular total para cotizaciones
    cotizacionesCotizaciones.forEach((cotizacion) => {
      cotizacion.CotizacionIndividuals.forEach((indiv) => {
        const { PrecioFinal, moneda } = indiv;
        const precioFinal = parseFloat(PrecioFinal);

        // Contar cada CotizacionIndividual
        result.COTIZACIONES.CANTIDADTOTAL += 1;

        if (moneda === "$") {
          result.COTIZACIONES.totalPesos += precioFinal;
        } else if (moneda === "USD") {
          result.COTIZACIONES.totalUSD += precioFinal;
        }
      });
    });

    // Calcular total para ventas
    cotizacionesVentas.forEach((cotizacion) => {
      cotizacion.CotizacionIndividuals.forEach((indiv) => {
        const { PrecioFinal, moneda } = indiv;
        const precioFinal = parseFloat(PrecioFinal);

        // Contar cada CotizacionIndividual
        result.VENTAS.CANTIDADTOTAL += 1;

        if (moneda === "$") {
          result.VENTAS.totalPesos += precioFinal;
        } else if (moneda === "USD") {
          result.VENTAS.totalUSD += precioFinal;
        }
      });
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener las sumatorias de cotizaciones:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// FUNCION QUE FILTRA POR FECHAS //

const filtrarCotizacionesPorFecha = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const decodedToken = jwt.decodeToken(
      token.replace("Bearer ", ""),
      JWTSECRET
    );
    const idUsuario = decodedToken.id;

    if (!idUsuario) {
      return res.status(400).json({ error: "Se requiere el ID de usuario" });
    }

    const usuario = await Usuarios.findByPk(idUsuario);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { fechaDesde, fechaHasta } = req.body;

    if (!fechaDesde || !fechaHasta) {
      return res.status(400).json({ message: "Las fechas son requeridas" });
    }

    const startDate = new Date(fechaDesde);
    const endDate = new Date(fechaHasta);
    endDate.setDate(endDate.getDate() + 1);

    let filtroUsuario = {};

    if (usuario.rol === false) {
      filtroUsuario = { idUsuario: idUsuario };
    }

    const cotizaciones = await Cotizaciones.findAll({
      where: {
        fechaDeCreacion: {
          [Op.between]: [startDate, endDate],
        },
        ...filtroUsuario,
      },
      include: [
        {
          model: Clientes,
          attributes: ["nombre", "apellido"],
        },
        {
          model: Usuarios,
          attributes: ["nombre", "apellido"],
        },
        {
          model: Productos,
          attributes: ["marca", "modelo"],
        },
        {
          model: CotizacionIndividual,
          attributes: [
            "cantidadProducto",
            "precio",
            "anticipo",
            "cuotas",
            "cuotaValor",
            "saldoAFinanciar",
            "IVA",
            "moneda",
            "interes",
            "saldoConInteres",
            "PrecioFinal",
            "estado",
          ],
        },
      ],
      order: [["fechaDeCreacion", "ASC"]],
    });

    if (!cotizaciones || cotizaciones.length === 0) {
      return res.status(404).json({
        error: "No se encontraron cotizaciones para la fecha especificada",
      });
    }

    return res.status(200).json(cotizaciones);
  } catch (error) {
    console.error("Error al filtrar cotizaciones:", error);
    return res.status(500).json({ message: "Error al filtrar cotizaciones" });
  }
};

const getCotizacionesPorModelo = async (req, res) => {
  try {
    // Obtener y verificar el token de autorización
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const decodedToken = jwt.decodeToken(
      token.replace("Bearer ", ""),
      JWTSECRET
    );
    const idUsuario = decodedToken.id;

    if (!idUsuario) {
      return res.status(400).json({ error: "Se requiere el ID de usuario" });
    }

    // Buscar el usuario para obtener su rol
    const usuario = await Usuarios.findByPk(idUsuario);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener el modelo del cuerpo de la solicitud
    const { modelo } = req.body;

    if (!modelo) {
      return res.status(400).json({ error: "El modelo es requerido" });
    }

    // Determinar si el rol permite ver todas las cotizaciones o solo las del usuario
    const whereClause = usuario.rol ? {} : { idUsuario };

    const cotizaciones = await Cotizaciones.findAll({
      where: whereClause, // Aplica el filtro de rol
      include: [
        {
          model: Productos,
          as: "Producto",
          attributes: ["familia", "marca", "modelo"],
          where: {
            modelo: {
              [Op.like]: `%${modelo}%`,
            },
          },
        },
        {
          model: Usuarios,
          attributes: ["nombre", "apellido"],
        },
        {
          model: Clientes,
          attributes: ["nombre", "apellido"],
        },
        {
          model: CotizacionIndividual,
          attributes: [
            "cantidadProducto",
            "precio",
            "anticipo",
            "cuotas",
            "cuotaValor",
            "saldoAFinanciar",
            "IVA",
            "moneda",
            "interes",
            "saldoConInteres",
            "PrecioFinal",
            "estado",
          ],
        },
      ],
      order: [["numeroCotizacion", "ASC"]],
    });

    if (!cotizaciones || cotizaciones.length === 0) {
      return res.status(404).json({
        error: "No se encontraron cotizaciones para el modelo especificado",
      });
    }

    // Retornar las cotizaciones encontradas
    return res.status(200).json(cotizaciones);
  } catch (error) {
    console.error("Error al obtener las cotizaciones por modelo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// FUNCION DE RANKING DE COTIZACIONES Y VENTAS POR VENDEDOR Y MODELO //

const getranking = async (req, res) => {
  try {
    // Obtener todas las cotizaciones activas con detalles de usuario, cliente y producto
    const cotizaciones = await CotizacionIndividual.findAll({
      where: { estado: [1, 2] }, // Traer tanto cotizaciones (1) como ventas (2)
      include: [
        {
          model: Cotizaciones,
          include: [
            {
              model: Usuarios,
              attributes: ["id", "nombre", "apellido"],
            },
            {
              model: Clientes,
              attributes: ["id", "nombre"],
            },
            {
              model: Productos,
              attributes: ["id", "modelo"],
            },
          ],
        },
      ],
      raw: true,
    });

    // Conteo de cotizaciones y ventas por usuario, cliente y producto
    const userCount = { cotizaciones: {}, ventas: {} };
    const clientCount = { cotizaciones: {}, ventas: {} };
    const productCount = { cotizaciones: {}, ventas: {} };

    cotizaciones.forEach((item) => {
      const userId = item["Cotizacione.Usuario.id"];
      const clientId = item["Cotizacione.Cliente.id"];
      const productId = item["Cotizacione.Producto.id"];
      const estado = item.estado;

      // Contar por usuario
      if (userId) {
        if (estado === 1) {
          userCount.cotizaciones[userId] =
            (userCount.cotizaciones[userId] || 0) + 1;
        } else if (estado === 2) {
          userCount.ventas[userId] = (userCount.ventas[userId] || 0) + 1;
        }
      }

      // Contar por cliente
      if (clientId) {
        if (estado === 1) {
          clientCount.cotizaciones[clientId] =
            (clientCount.cotizaciones[clientId] || 0) + 1;
        } else if (estado === 2) {
          clientCount.ventas[clientId] =
            (clientCount.ventas[clientId] || 0) + 1;
        }
      }

      // Contar por producto
      if (productId) {
        if (estado === 1) {
          productCount.cotizaciones[productId] =
            (productCount.cotizaciones[productId] || 0) + 1;
        } else if (estado === 2) {
          productCount.ventas[productId] =
            (productCount.ventas[productId] || 0) + 1;
        }
      }
    });

    // Función para encontrar el top con validaciones
    const findTop = (count) => {
      const keys = Object.keys(count);
      if (keys.length === 0) return null; // No hay datos
      return keys.reduce((a, b) => (count[a] > count[b] ? a : b));
    };

    // Encontrar el top para cotizaciones y ventas
    const topUserIdCotizaciones = findTop(userCount.cotizaciones);
    const topUserIdVentas = findTop(userCount.ventas);
    const topClientIdCotizaciones = findTop(clientCount.cotizaciones);
    const topClientIdVentas = findTop(clientCount.ventas);
    const topProductIdCotizaciones = findTop(productCount.cotizaciones);
    const topProductIdVentas = findTop(productCount.ventas);

    // Obtener detalles del usuario top para cotizaciones
    const topUserDetailsCotizaciones = topUserIdCotizaciones
      ? await Usuarios.findByPk(topUserIdCotizaciones, {
          attributes: ["nombre", "apellido"],
        })
      : null;

    // Obtener detalles del usuario top para ventas
    const topUserDetailsVentas = topUserIdVentas
      ? await Usuarios.findByPk(topUserIdVentas, {
          attributes: ["nombre", "apellido"],
        })
      : null;

    // Obtener detalles del cliente top para cotizaciones
    const topClientDetailsCotizaciones = topClientIdCotizaciones
      ? await Clientes.findByPk(topClientIdCotizaciones, {
          attributes: ["nombre", "apellido"],
        })
      : null;

    // Obtener detalles del cliente top para ventas
    const topClientDetailsVentas = topClientIdVentas
      ? await Clientes.findByPk(topClientIdVentas, {
          attributes: ["nombre", "apellido"],
        })
      : null;

    // Obtener detalles del producto top para cotizaciones
    const topProductDetailsCotizaciones = topProductIdCotizaciones
      ? await Productos.findByPk(topProductIdCotizaciones, {
          attributes: ["familia", "marca", "modelo"],
        })
      : null;

    // Obtener detalles del producto top para ventas
    const topProductDetailsVentas = topProductIdVentas
      ? await Productos.findByPk(topProductIdVentas, {
          attributes: ["familia", "marca", "modelo"],
        })
      : null;

    return res.status(200).json({
      topUserCotizaciones: topUserIdCotizaciones
        ? {
            id: topUserIdCotizaciones,
            nombre: topUserDetailsCotizaciones?.nombre,
            apellido: topUserDetailsCotizaciones?.apellido,
            count: userCount.cotizaciones[topUserIdCotizaciones],
          }
        : null,
      topUserVentas: topUserIdVentas
        ? {
            id: topUserIdVentas,
            nombre: topUserDetailsVentas?.nombre,
            apellido: topUserDetailsVentas?.apellido,
            count: userCount.ventas[topUserIdVentas],
          }
        : null,
      topClientCotizaciones: topClientIdCotizaciones
        ? {
            id: topClientIdCotizaciones,
            nombre: topClientDetailsCotizaciones?.nombre,
            apellido: topClientDetailsCotizaciones?.apellido,
            count: clientCount.cotizaciones[topClientIdCotizaciones],
          }
        : null,
      topClientVentas: topClientIdVentas
        ? {
            id: topClientIdVentas,
            nombre: topClientDetailsVentas?.nombre,
            apellido: topClientDetailsVentas?.apellido,
            count: clientCount.ventas[topClientIdVentas],
          }
        : null,
      topProductCotizaciones: topProductIdCotizaciones
        ? {
            id: topProductIdCotizaciones,
            nombre: topProductDetailsCotizaciones?.modelo,
            familia: topProductDetailsCotizaciones?.familia,
            marca: topProductDetailsCotizaciones?.marca,
            count: productCount.cotizaciones[topProductIdCotizaciones],
          }
        : null,
      topProductVentas: topProductIdVentas
        ? {
            id: topProductIdVentas,
            nombre: topProductDetailsVentas?.modelo,
            familia: topProductDetailsCotizaciones?.familia,
            marca: topProductDetailsCotizaciones?.marca,
            count: productCount.ventas[topProductIdVentas],
          }
        : null,
    });
  } catch (error) {
    console.error("Error al obtener el ranking:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  createCotizacion,
  getCotizaciones,
  getCantidadCotizacionesPorUsuario,
  getCotizacionDetalle,
  putCotizaciones,
  updateCotizacionEstado,
  sumarPreciosFinales,
  sumarPreciosFinalesPorMonedaYEstado,
  getCotizacionesEstadoDos,
  getVentaById,
  getUltimasCotizaciones,
  getCotizacionesSum,
  filtrarCotizacionesPorFecha,
  getCotizacionesPorModelo,
  getranking,
  getCotizacionesEstadoTres,
  updateCotizacionPdf,
};
