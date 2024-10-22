const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { NODEMAILER_HOST, NODEMAILER_PORT, NODEMAILER_USER, NODEMAILER_PASS } =
  process.env;
const jwt = require("../services/jwt.js");
const { JWTSECRET } = process.env;
const { MailsMasivos } = require("../db.js");
const mailsMasivos = require("../mailer/templates/mailsMasivos.js");
const cotizacionEmail = require("../mailer/templates/Cotizacion.js");
const { Cotizaciones } = require("../db.js");
const { CotizacionIndividual } = require("../db.js");
const { Usuarios } = require("../db.js");
const { Productos } = require("../db.js");
const { Clientes } = require("../db.js");

const enviarCotizacionPorEmail = async (req, res) => {
  try {
    const { emailEmisor, emailsReceptores, idCotizacion, password } = req.body;

    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Token de autenticación requerido." });
    }

    const decodedToken = jwt.decodeToken(
      token.replace("Bearer ", ""),
      JWTSECRET
    );
    const email = decodedToken.email;
    const hashedPassword = decodedToken.password;

    if (!emailEmisor || !emailsReceptores) {
      return res
        .status(400)
        .json({ error: "Emisor y receptor son requeridos." });
    }

    if (!password) {
      return res.status(400).json({ error: "La contraseña es requerida." });
    }

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return res.status(404).json({ error: "Credenciales no válidas." });
    }

    // Obtener la cotización y su relación con CotizacionIndividual, Clientes, Productos y Usuarios
    const cotizacion = await Cotizaciones.findOne({
      where: { id: idCotizacion },
      include: [
        {
          model: Usuarios,
          attributes: ["nombre", "apellido", "email"],
        },
        {
          model: Clientes,
          attributes: ["razonSocial", "CUIT", "apellido", "mail", "nombre"],
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
            "fichaPDF",
          ],
        },
        {
          model: CotizacionIndividual,
          where: { estado: 1 },
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

    if (!cotizacion) {
      return res.status(404).json({ error: "Cotización no encontrada." });
    }

    const cotizacionDetalle = {
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
        fichaPDF: cotizacion.Producto.fichaPDF,
      },
    };

    const transporter = nodemailer.createTransport({
      host: NODEMAILER_HOST,
      port: NODEMAILER_PORT,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

    const emailOptions = {
      from: emailEmisor,
      to: [...emailsReceptores, emailEmisor].join(", "),
      subject: `Cotización de ${cotizacionDetalle.producto.familia}, ${cotizacionDetalle.producto.marca}, ${cotizacionDetalle.producto.modelo}`,
      html: cotizacionEmail({
        ...cotizacionDetalle,
        producto: {
          ...cotizacionDetalle.producto,
          fichaPDF: cotizacionDetalle.producto.fichaPDF,
        },
      }),
    };

    await transporter.sendMail(emailOptions);

    return res.status(201).json({
      message: "Cotización enviada exitosamente.",
    });
  } catch (error) {
    console.error("Error al enviar la cotización:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

const enviarMailsMasivos = async (req, res) => {
  try {
    const {
      emailEmisor,
      emailsReceptores,
      cuerpoMensaje,
      password,
      imagen,
      imagen1,
      pdf,
    } = req.body;

    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Token de autenticación requerido." });
    }

    const decodedToken = jwt.decodeToken(
      token.replace("Bearer ", ""),
      JWTSECRET
    );
    const email = decodedToken.email;
    const hashedPassword = decodedToken.password;

    if (!emailEmisor || !emailsReceptores || emailsReceptores.length === 0) {
      return res
        .status(400)
        .json({ error: "Emisor y receptores son requeridos." });
    }

    if (!password) {
      return res.status(400).json({ error: "La contraseña es requerida." });
    }

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return res.status(404).json({ error: "Credenciales no válidas." });
    }

    const transporter = nodemailer.createTransport({
      host: NODEMAILER_HOST,
      port: NODEMAILER_PORT,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

    const correosMasivos = emailsReceptores.map((emailReceptor) => ({
      emailEmisor,
      emailReceptor,
      cuerpoMensaje,
      imagen,
      imagen1,
      pdf,
    }));

    // Guardar los correos en la base de datos
    const resultado = await MailsMasivos.bulkCreate(correosMasivos, {
      ignoreDuplicates: true,
    });

    const sendEmailWithTemplate = (to, cuerpoMensaje, pdf, imagen, imagen1) => {
      const emailOptions = {
        from: emailEmisor,
        to,
        subject: "NOTIFICACIONES / OFERTAS",
        html: mailsMasivos(cuerpoMensaje, pdf, imagen, imagen1),
      };

      return transporter.sendMail(emailOptions);
    };

    // Enviar los correos
    await Promise.all(
      correosMasivos.map(({ emailReceptor }) =>
        sendEmailWithTemplate(
          emailReceptor,
          cuerpoMensaje,
          pdf,
          imagen,
          imagen1
        )
      )
    );

    await sendEmailWithTemplate(
      emailEmisor,
      cuerpoMensaje,
      pdf,
      imagen,
      imagen1
    );

    await MailsMasivos.destroy({ where: {} });

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
  enviarCotizacionPorEmail,
};
