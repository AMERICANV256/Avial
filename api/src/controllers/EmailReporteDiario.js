const cron = require("node-cron");
const { HistorialCotizacion } = require("../db.js");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const programarReporteDiario = () => {
  // Ejecuta el cron job diariamente a las 00:00
  cron.schedule("0 0 * * *", async () => {
    // Ejecuta el cron job cada minuto (para pruebas)
    //   cron.schedule("* * * * *", async () => {
    try {
      const hoy = new Date();
      hoy.setUTCDate(hoy.getUTCDate() - 1);
      hoy.setUTCHours(0, 0, 0, 0);

      const mañana = new Date(hoy);
      mañana.setUTCDate(hoy.getUTCDate() + 1);

      const historialCotizaciones = await HistorialCotizacion.findAll({
        where: {
          fechaDeCreacion: {
            [Op.gte]: hoy,
            [Op.lt]: mañana,
          },
        },
      });

      // Generar y enviar el reporte
      await generarReporteDiario(historialCotizaciones);
    } catch (error) {
      console.error("Error al generar el reporte diario:", error);
    }
  });
};

const generarReporteDiario = async (data) => {
  // Generar el template HTML para el reporte
  const template = crearTemplateReporte(data);

  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: "matipineda85@live.com.ar",
    subject: "Reporte Diario de Cotizaciones",
    html: template,
  };

  // Envía el correo
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return console.log("Error al enviar el correo:", error);
    }
    console.log("Correo enviado:");
  });
};

const crearTemplateReporte = (data) => {
  const estadoMap = {
    1: "Cotización",
    2: "Venta",
    3: "Pendiente",
  };
  let html = `
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        padding: 20px;
      }
      h1 {
        text-align: center;
        color: #0056b3;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #0056b3;
        color: white;
      }
      tr:nth-child(even) {
        background-color: #f2f2f2;
      }
      tr:hover {
        background-color: #ddd;
      }
    </style>
    <h1>Reporte Diario de Cotizaciones</h1>
    <table>
      <tr>
        <th>Código Cotización</th>
        <th>Nombre Vendedor</th>
        <th>Apellido Vendedor</th>
        <th>Familia</th>
        <th>Marca</th>
        <th>Modelo</th>
        <th>Nombre Cliente</th>
        <th>Apellido Cliente</th>
        <th>Email Cliente</th>
        <th>Precio</th>
        <th>IVA</th>
        <th>Cuotas</th>
        <th>Valor Cuota</th>
        <th>Anticipo</th>
        <th>Saldo a Financiar</th>
        <th>Interés</th>
        <th>Saldo con Interés</th>
        <th>Precio Final</th>
        <th>Fecha de Creación</th>
        <th>Estado</th>
     
      </tr>`;

  data.forEach((item) => {
    html += `<tr>
      <td>${item.codigoCotizacion}</td>
          <td>${item.nombreVendedor || "N/A"}</td>
      <td>${item.apellidoVendedor || "N/A"}</td>
        <td>${item.familia || "N/A"}</td>
      <td>${item.marca || "N/A"}</td>
      <td>${item.modelo || "N/A"}</td>
        <td>${item.nombreCliente || "N/A"}</td>
      <td>${item.apellidoCliente || "N/A"}</td>
      <td>${item.mailCliente || "N/A"}</td>
      <td>${item.precio}</td>
       <td>${item.IVA || "N/A"}</td>
      <td>${item.cuotas || "N/A"}</td>
      <td>${item.cuotaValor || "N/A"}</td>
      <td>${item.anticipo || "N/A"}</td>
      <td>${item.saldoAFinanciar || "N/A"}</td>
      <td>${item.interes || "N/A"}</td>
      <td>${item.saldoConInteres || "N/A"}</td>
      <td>${item.PrecioFinal}</td>
      <td>${new Date(item.fechaDeCreacion).toLocaleDateString("es-ES") || "N/A"}</td>
       <td>${estadoMap[item.estado] || "N/A"}</td>
     
  
    </tr>`;
  });

  html += `</table>`;
  return html;
};

module.exports = programarReporteDiario;
