const cotizacionEmail = (cotizacion) => {
  const PDFUrl =
    "https://res.cloudinary.com/dmfzplfra/image/upload/v1727730981/PDF_b1hsox.png"; // URL pública de la imagen para el PDF
  const americanVialImage =
    "https://res.cloudinary.com/dr5okg3aq/image/upload/v1729551600/lqrtopb1j9msb03svol5.png"; // URL de la imagen de American Vial

  const notasEmail = cotizacion.notasEmail || "";

  // Filtrar cotizacionesIndividuales para incluir solo aquellas con más de 1 cuota
  const cotizacionesIndividuales = cotizacion.cotizacionesIndividuales
    .filter((item) => item.cuotas > 1) // Filtra las que tienen más de 1 cuota
    .map((item, index) => {
      const cuotasOption =
        item.cuotas > 1
          ? `Opción ${index + 1}: ${item.anticipoPorcentaje}% anticipo y ${
              item.cuotas
            } E-Cheq`
          : `${item.anticipoPorcentaje}% anticipo y ${item.cuotas} E-Cheq`;
      const saldoConInteres = item.saldoConInteres || 0;
      const cuotaValorEnPesos = item.cuotaValorEnPesos || 0;

      return `        
      <li style="margin-bottom: 30px; list-style: none; padding: 10px 0; text-align: left; position: relative;">
        <span style="position: absolute; left: -20px; top: 10px; width: 10px; height: 10px; border-radius: 50%; background-color: #000;"></span>
        <strong style="text-decoration: underline; margin-bottom: 5px; display: block;">${cuotasOption}:</strong> 
        <strong>${cotizacion.formaPago}</strong>  ${
        item.anticipoPorcentaje
      }% - Anticipo USD: ${item.anticipo} equivalentes a $ ${(
        item.anticipo * item.cotizacionDolar
      ).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
         <br />
        <span style="background-color: #ffeaa7;  border-radius: 3px;">
         <strong>Saldo en</strong> ${item.cuotas} E-Cheq de U$D ${Math.trunc(
        item.cuotaValor
      )} equivalentes a ${(Number(cuotaValorEnPesos) || 0).toLocaleString(
        "es-ES",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )} cada 30 días fijos
        </span> en pesos. <br />
      <strong>IVA con otro E-Cheq a 30 días de:</strong> $${(item.anticipo > 0
        ? (item.cuotaValorEnPesos * item.cuotas +
            item.anticipo * item.cotizacionDolar) *
          (item.IVA / 100)
        : item.cuotaValorEnPesos * item.cuotas * (item.IVA / 100)
      ).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
       <br />
      </li>`;
    })
    .join("");

  const primerCotizacion = cotizacion.cotizacionesIndividuales[0];

  return `
    <div style="font-family: 'Arial', sans-serif; color: #333; padding: 10px 10px 10px; background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 4px; width: 95%; margin: auto; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
      <h5 style="text-align: right; color: #444; font-weight: normal; font-size: 16px; opacity: 0.8;">Cotización N°: ${
        cotizacion.codigoCotizacion
      }</h5>
      <p style="text-align: left; margin: 0; font-weight: bold;">Cliente:</p>
      <p style="text-align: left; margin: 0; color: rgba(0, 0, 0, 0.6);">Razón Social: ${
        cotizacion.cliente.razonSocial
      } &nbsp; CUIT: (${cotizacion.cliente.CUIT})</p>
      <p style="text-align: left; margin: 0; color: rgba(0, 0, 0, 0.6);">${
        cotizacion.cliente.nombre
      } ${cotizacion.cliente.apellido}</p>
      <p style="text-align: left; font-weight: 600; font-size: 16px; margin-top: 35px;">${notasEmail}</p>
      <h2 style="text-align: center; color: #555; font-size: 20px; text-decoration: underline;margin-top: 35px;">Detalles de la Cotización</h2>
      <p style="text-align: center;">
        <strong>VALOR PAGO DE CONTADO:</strong> U$S ${Math.floor(
          primerCotizacion.precio
        )} + IVA 10.5% <br />
        <strong>Cotización Dólar BNA:</strong> Ejemplo Hoy BNA $ ${
          primerCotizacion.cotizacionDolar
        }, Precio en Pesos: $${(
    Number(primerCotizacion.precioEnPesos) || 0
  ).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}

        + IVA 10.5%
      </p>
      <p style="text-align: center; font-weight: bold; color: #f00;">Propuesta de financiación POR TIEMPO LIMITADO sujeto a aprobación</p>
      <ul style="padding: 0; margin: 0; list-style-type: none; text-align: center;">
        ${cotizacionesIndividuales}
      </ul>
      <p style="font-weight: bold; text-decoration: underline; text-align: center;">ENTREGA INMEDIATA</p>
      <div style="text-align: center; margin: 20px 0; font-weight: bold;">
        <p>Plazo de Entrega: ${cotizacion.plazoEntrega}</p>
        <p>Mantenimiento de Oferta: ${cotizacion.mantenimientoOferta}</p>
        <p>Lugar de Entrega: ${cotizacion.lugarEntrega}</p>
        <p>Garantía: ${cotizacion.garantia}</p>
        <p>Entrega Técnica: ${cotizacion.entregaTecnica}</p>
      </div>
      <div style="display: flex; justify-content: space-around; gap: 40px; margin-bottom: 50px;">
        <div style="text-align: center;">
          <a href="${
            cotizacion.CotizacionPDF
          }" download style="text-decoration: none;">
            <img src="${PDFUrl}" alt="Descargar PDF" style="width: 50px; height: auto; border: none;" />
          </a>
          <div style="margin-top: 5px; font-weight: bold; font-size: 16px;">Cotización ${
            cotizacion.codigoCotizacion
          }</div>
        </div>
        <div style="text-align: center;">
          <a href="${
            cotizacion.producto.fichaPDF
          }" download style="text-decoration: none;">
            <img src="${PDFUrl}" alt="Descargar Ficha" style="width: 50px; height: auto; border: none;" />
          </a>
          <div style="margin-top: 5px; font-weight: bold; font-size: 16px;">Ficha Técnica de ${
            cotizacion.producto.familia
          } ${cotizacion.producto.marca} ${cotizacion.producto.modelo}</div>
        </div>
      </div>
        <hr style="margin-top: 30px; margin-bottom: 10px;" />
      <div style="margin-top: 30px; text-align: center;">
        <img src="${americanVialImage}" alt="American Vial" style="width: 200px; height: auto; display: block; margin: 10px auto;" />
        <p style="margin: 10px 0; font-weight: bold;">
          Paris 256 esq. Colectora Este <br />
          1611 - Don Torcuato - Bs. As.<br />
          Tel./Fax : (+54) 11 4748 5900 / int. 273
        </p>
        <a href="http://www.americanvial.com" style="display: block; margin-bottom: 20px; font-weight: bold;">
          www.americanvial.com
        </a>
      </div>
    </div>
  `;
};

module.exports = cotizacionEmail;
