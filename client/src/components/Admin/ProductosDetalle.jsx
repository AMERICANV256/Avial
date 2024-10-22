import React from "react";
import { useParams } from "react-router-dom";
import { useProducto } from "../../hooks/useProductos";
import Spinner from "../../UI/Spinner";
import BackButton from "../../UI/BackButton";

export default function ProductosDetalle() {
  const { id } = useParams();
  const { data: productoData, isLoading } = useProducto(id).productoQueryById;

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  // Campos que quieres excluir
  const excludedFields = [
    "fichaPDF",
    "imagen",
    "imagen1",
    "imagen2",
    "imagen3",
    "imagen4",
    "imagen5",
    "imagen6",
    "Detalles",
    "id",
  ];

  // Función para separar los títulos compuestos y capitalizar la primera letra
  const formatFieldName = (field) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const itemStyle = {
    marginBottom: "10px",
    textTransform: "capitalize",
    display: "flex",
    justifyContent: "center",
  };

  return (
    <div className="postVentaContainer1">
      <BackButton />
      <h3 style={itemStyle} className="tituloCompo">
        Detalle del Producto
      </h3>
      <br />
      <div>
        {Object.keys(productoData)
          .filter((key) => !excludedFields.includes(key))
          .map((key) => (
            <div key={key}>
              <strong>{formatFieldName(key)}:</strong> {productoData[key]}
              <hr />
            </div>
          ))}
      </div>
    </div>
  );
}
