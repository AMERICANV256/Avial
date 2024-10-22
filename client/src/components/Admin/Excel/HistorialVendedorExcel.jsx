import React from "react";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";

const HistorialVendedorExcel = ({ data }) => {
  const handleExport = () => {
    // Crear un nuevo array con los elementos específicos
    const filteredData = data.data.map((item) => {
      let estado = "";

      if (item.estado === 2) {
        estado = "Venta concretada";
      }
      if (item.estado === 1) {
        estado = "Venta No Concretada";
      }

      return {
        "Número de Cotización": item.codigoCotizacion,
        Producto: `${item.familia} ${item.marca} ${item.modelo}`,
        Cliente: `${item.nombreCliente} ${item.apellidoCliente}`,
        Vendedor: `${item.nombreVendedor} ${item.apellidoVendedor}`,
        Moneda: item.moneda,
        Anticipo: item.anticipo,
        IVA: item.IVA,
        "Precio de Venta": item.precio,
        "Saldo a Financiar": `${item.moneda} ${parseFloat(
          item.saldoAFinanciar
        ).toFixed(2)}`,
        Cuotas: item.cuotas,
        Financiación: `${item.moneda} ${parseFloat(item.cuotaValor).toFixed(
          2
        )}`,
        "Precio Final": item.PrecioFinal,

        "Fecha de Creación": new Date(
          item.fechaDeCreacion
        ).toLocaleDateString(),

        Estado: estado,
      };
    });

    // Obtener el nombre y apellido del vendedor
    const vendedor = data.data[0]
      ? `${data.data[0].nombreVendedor} ${data.data[0].apellidoVendedor}`
      : "Vendedor";

    // Crear una hoja de trabajo vacía
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Agregar el título y la fecha al principio de la hoja
    const currentDate = new Date().toLocaleDateString();
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          `REPORTE DE HISTORIAL DE COTIZACIONES DE ${vendedor} AL DÍA ${currentDate}`,
        ],
      ],
      { origin: "A1" }
    );

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
    XLSX.writeFile(workbook, "HistorialVendedor.xlsx");
  };

  return (
    <button className="excel" onClick={handleExport}>
      <SiMicrosoftexcel size={34} color="#217346" />
      Excel
    </button>
  );
};

export default HistorialVendedorExcel;
