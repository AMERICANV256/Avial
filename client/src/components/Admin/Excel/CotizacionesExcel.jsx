import React from "react";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";

const CotizacionesExcel = ({ data }) => {
  const handleExport = () => {
    const rows = [];

    console.log(data);

    data.forEach((item) => {
      rows.push({
        NroCotización: item.codigoCotizacion,
        Categoria: item.Producto.familia,
        Marca: item.Producto.marca,
        Modelo: item.Producto.modelo,

        Vendedor: `${item.Usuario.nombre} ${item.Usuario.apellido}`,
        Cliente: `${item.Cliente.nombre} ${item.Cliente.apellido}`,
      });

      item.CotizacionIndividuals.forEach((cotizacionInd) => {
        rows.push({
          Moneda: "U$D",
          "Precio de Venta": cotizacionInd.precio,

          Cuotas: cotizacionInd.cuotas,
          "Valor de las cuotas": ` ${parseFloat(
            cotizacionInd.cuotaValor
          ).toFixed(2)}`,
          Interés: cotizacionInd.interes,
          Anticipo: cotizacionInd.anticipo,
          "Saldo a Financiar": ` ${parseFloat(
            cotizacionInd.saldoAFinanciar
          ).toFixed(2)}`,

          PrecioFinal: cotizacionInd.PrecioFinal,
          "Fecha de Cotización": new Date(
            cotizacionInd.fechaDeCreacion
          ).toLocaleDateString(),
        });
      });

      rows.push({});
    });

    const ws = XLSX.utils.json_to_sheet(rows, { origin: "A3" });

    const currentDate = new Date().toLocaleDateString();
    XLSX.utils.sheet_add_aoa(
      ws,
      [["REPORTE DE COTIZACIONES AL DÍA " + currentDate]],
      { origin: "A1" }
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cotizaciones");

    XLSX.writeFile(wb, "Cotizaciones.xlsx");
  };

  return (
    <button className="excel" onClick={handleExport}>
      <SiMicrosoftexcel size={34} color="#217346" />
      Excel
    </button>
  );
};

export default CotizacionesExcel;
