const cron = require("node-cron");
const {
  Cotizaciones,
  Clientes,
  Productos,
  Usuarios,
  CotizacionIndividual,
} = require("../db.js");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const cotizacionEmail = require("../mailer/templates/Cotizacion.js");
const { conn } = require("../db.js");

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

const iniciarCronJob = () => {
  // Ejecuta el cron job diariamente a las 00:00
  cron.schedule("0 0 * * *", async () => {
    // Ejecuta el cron job cada minuto (para pruebas)
    // cron.schedule("* * * * *", async () => {

    // NO MODIFIQUE LAS VARIABLES, PERO MODIFIQUE EL VALOR (SON 5 DIAS POSTERIORES A LA COTI) //

    try {
      const hoy = new Date();
      const treintaDiasAtras = new Date(hoy);
      treintaDiasAtras.setDate(hoy.getDate() - 5);

      // Normaliza la fecha a medianoche
      treintaDiasAtras.setHours(0, 0, 0, 0);

      // Buscar cotizaciones creadas hace 30 días sin considerar la hora
      const cotizacionesInactivas = await Cotizaciones.findAll({
        where: {
          [Op.and]: [
            conn.where(
              conn.fn("DATE", conn.col("Cotizaciones.fechaDeCreacion")),
              {
                [Op.eq]: treintaDiasAtras.toISOString().split("T")[0],
              }
            ),
            { fechaModi: null },
            { fechaVenta: null },
          ],
        },

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

      // Enviar un correo electrónico a cada cliente con cotizaciones inactivas
      for (let cotizacion of cotizacionesInactivas) {
        const cliente = cotizacion.Cliente;
        const usuario = cotizacion.Usuario;
        const producto = cotizacion.Producto;
        const cotizacionesIndividuales = cotizacion.CotizacionIndividuals || [];

        if (cliente && producto && usuario) {
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
            cotizacionesIndividuales: cotizacionesIndividuales,
            cliente: {
              razonSocial: cliente.razonSocial,
              CUIT: cliente.CUIT,
              email: cliente.mail,
              apellido: cliente.apellido,
              nombre: cliente.nombre,
            },
            usuario: {
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              email: usuario.email,
            },
            producto: {
              division: producto.division,
              familia: producto.familia,
              marca: producto.marca,
              modelo: producto.modelo,
              motor: producto.motor,
              caracteristicasGenerales: producto.caracteristicasGenerales,
              motoresdeTraslacionyZapatas: producto.motoresdeTraslacionyZapatas,
              sistemaHidraulico: producto.sistemaHidraulico,
              capacidades: producto.capacidades,
              Cabina: producto.Cabina,
              dimensionesGenerales: producto.dimensionesGenerales,
              imagen: producto.imagen,
              imagen1: producto.imagen1,
              imagen2: producto.imagen2,
              fichaPDF: producto.fichaPDF,
            },
          };

          const emailOptions = {
            from: process.env.NODEMAILER_USER,
            to: cliente.mail,
            subject: `Recordatorio de cotización para ${producto.familia} ${producto.marca} ${producto.modelo} - AMERICAN VIAL`,
            html: cotizacionEmail(cotizacionDetalle),
          };

          await transporter.sendMail(emailOptions);

          console.log(
            `Correo enviado a ${cliente.mail} para el producto ${producto.marca} ${producto.modelo}`
          );
        }
      }
    } catch (error) {
      console.error("Error al enviar correos de recordatorio:", error);
    }
  });
};

module.exports = iniciarCronJob;
