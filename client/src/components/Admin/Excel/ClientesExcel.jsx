import React from "react";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";

const ClientesExcel = ({ data }) => {
  const handleExport = () => {
    // Crear un nuevo array con los elementos específicos
    const filteredData = data.map((item) => ({
      Nombre: item.nombre,
      Apellidos: item.apellido,
      Email: item.mail,
      CUIT: item.CUIT,
      "Razon Social": item.razonSocial,
      Telefono: item.telefono,
      "Contacto Alternativo": item.contactoAlternativo,
      "Email Alternativo": item.mailAlternativo,
      "Teléfono Alternativo": item.telefonoAlternativo,
      "Contacto Alternativo 1": item.contactoAlternativo1,
      "Email Alternativo 1": item.mailAlternativo1,
      "Teléfono Alternativo 1": item.telefonoAlternativo1,
      "Fecha de Registro": new Date(item.fechaDeCreacion).toLocaleDateString(),
    }));

    // Crear una hoja de trabajo a partir de los datos
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Agregar el título y la fecha al principio de la hoja
    const currentDate = new Date().toLocaleDateString();
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["REPORTE DE LOS CLIENTES AL DIA " + currentDate]],
      { origin: "A1" }
    );

    // Agregar una fila vacía después del título
    XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: "A2" });

    // Agregar los datos de los clientes empezando en la tercera fila
    XLSX.utils.sheet_add_json(worksheet, filteredData, {
      origin: "A3",
      skipHeader: false,
    });

    // Crear un libro de trabajo y agregar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(workbook, "Clientes.xlsx");
  };

  return (
    <button className="excel" onClick={handleExport}>
      <SiMicrosoftexcel size={34} color="#217346" />
      Excel
    </button>
  );
};

export default ClientesExcel;
