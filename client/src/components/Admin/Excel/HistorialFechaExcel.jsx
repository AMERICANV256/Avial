import React from "react";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";

const HistorialFechaExcel = ({ data, fechaDesde, fechaHasta }) => {
  const handleExport = () => {
    const cotizaciones = Array.isArray(data.data) ? data.data : [];

    const filteredData = cotizaciones
      .map((item) =>
        item.CotizacionIndividuals.map((cotizacion) => {
          let estado = "";
          if (cotizacion.estado === 2) {
            estado = "Venta concretada";
          }
          if (cotizacion.estado === 1) {
            estado = "Venta No Concretada";
          }

          return {
            "Número de Cotización": item.codigoCotizacion,
            Producto: `${item.Producto.marca} ${item.Producto.modelo}`,
            Cliente: `${item.Cliente.nombre} ${item.Cliente.apellido}`,
            Vendedor: `${item.Usuario.nombre} ${item.Usuario.apellido}`,
            Moneda: cotizacion.moneda,
            "Precio de Venta": cotizacion.precio,
            "Saldo a Financiar": `${cotizacion.moneda} ${parseFloat(
              cotizacion.saldoAFinanciar
            ).toFixed(2)}`,
            Cuotas: cotizacion.cuotas,
            Financiación: `${cotizacion.moneda} ${parseFloat(
              cotizacion.cuotaValor
            ).toFixed(2)}`,
            Anticipo: cotizacion.anticipo,
            IVA: cotizacion.IVA,
            "Precio Final": cotizacion.PrecioFinal,
            "Fecha de Creación": new Date(
              item.fechaDeCreacion
            ).toLocaleDateString(),

            Estado: estado,
          };
        })
      )
      .flat();

    // Crear una hoja de trabajo vacía
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Construir el título con las fechas desde y hasta
    const currentDate = new Date().toLocaleDateString();
    const title = `REPORTE DE HISTORIAL DESDE ${fechaDesde} HASTA ${fechaHasta} AL DÍA ${currentDate}`;
    XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: "A1" });

    // Agregar una fila vacía después del título
    XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: -1 });

    // Agregar los datos del historial de ventas empezando en la tercera fila
    XLSX.utils.sheet_add_json(worksheet, filteredData, {
      origin: -1,
      skipHeader: false,
    });

    // Crear un libro de trabajo y agregar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(workbook, "HistorialFecha.xlsx");
  };

  return (
    <button className="excel" onClick={handleExport}>
      <SiMicrosoftexcel size={34} color="#217346" />
      Excel
    </button>
  );
};

export default HistorialFechaExcel;
