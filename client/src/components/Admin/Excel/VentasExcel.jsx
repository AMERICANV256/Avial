import React from "react";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";

const VentasExcel = ({ data }) => {
  const handleExport = () => {
    const filteredData = data.map((item) => ({
      NroCotización: item.Cotizacione.codigoCotizacion,
      Vendedor: `${item.Cotizacione.Usuario.nombre} ${item.Cotizacione.Usuario.apellido}`,
      Cliente: `${item.Cotizacione.Cliente.nombre} ${item.Cotizacione.Cliente.apellido}`,
      Categoria: item.Cotizacione.Producto.familia,
      Marca: item.Cotizacione.Producto.marca,
      Modelo: item.Cotizacione.Producto.modelo,
      Moneda: "U$D",
      "Precio de Venta": parseFloat(item.precio).toFixed(2),
      "Saldo a Financiar": `U$D ${parseFloat(item.saldoAFinanciar).toFixed(2)}`,
      Cuotas: item.cuotas,
      Financiación: `U$D ${parseFloat(item.cuotaValor).toFixed(2)}`,
      Anticipo: `U$D ${parseFloat(item.anticipo).toFixed(2)}`,
      PrecioFinal: `U$D ${parseFloat(item.PrecioFinal).toFixed(2)}`,
      FechaVenta: new Date(item.fechaVenta).toLocaleDateString(),
    }));

    // Crear una hoja de trabajo vacía
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Agregar el título y la fecha al principio de la hoja
    const currentDate = new Date().toLocaleDateString();
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["REPORTE DE VENTAS AL DÍA " + currentDate]],
      { origin: "A1" }
    );

    // Agregar dos filas vacías después del título
    XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: -1 });
    XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: -1 });

    // Agregar los datos de las ventas empezando en la tercera fila
    XLSX.utils.sheet_add_json(worksheet, filteredData, {
      origin: -1,
      skipHeader: false,
    });

    // Crear un libro de trabajo y agregar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");

    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(workbook, "Ventas.xlsx");
  };

  return (
    <button className="excel" onClick={handleExport}>
      <SiMicrosoftexcel size={34} color="#217346" />
      Excel
    </button>
  );
};

export default VentasExcel;
