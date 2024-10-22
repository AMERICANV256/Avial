import React from "react";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";

const HistorialProductoExcel = ({ data }) => {
  const handleExport = () => {
    // Asegurarse de que data sea un array (data.data)
    const cotizaciones = Array.isArray(data.data) ? data.data : [];

    // Crear un nuevo array con los elementos específicos
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
            Producto: `${item.Producto.familia} ${item.Producto.marca} ${item.Producto.modelo}`,
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
      .flat(); // Aplanar el array de arrays resultantes

    // Obtener el nombre completo del producto
    const producto = cotizaciones[0]
      ? `${cotizaciones[0].Producto.familia} ${cotizaciones[0].Producto.marca} ${cotizaciones[0].Producto.modelo}`
      : "Producto";

    // Crear una hoja de trabajo vacía
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Agregar el título y la fecha al principio de la hoja
    const currentDate = new Date().toLocaleDateString();
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`REPORTE DE HISTORIAL DE PRODUCTO ${producto} AL DÍA ${currentDate}`]],
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
    XLSX.writeFile(workbook, "HistorialProducto.xlsx");
  };

  return (
    <button className="excel" onClick={handleExport}>
      <SiMicrosoftexcel size={34} color="#217346" />
      Excel
    </button>
  );
};

export default HistorialProductoExcel;
