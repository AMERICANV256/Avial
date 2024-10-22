import React from "react";
import { useRepuesto } from "../../hooks/useRepuestos";
import { useParams } from "react-router-dom";
import Spinner from "../../UI/Spinner";
import BackButton from "../../UI/BackButton";

export default function RepuestosDetail() {
  const { id } = useParams();
  const { data: repuestoDetalle, isLoading } =
    useRepuesto(id).repuestoQueryById;

  if (isLoading) {
    return (
      <div>
        {" "}
        <Spinner />
      </div>
    );
  }
  return (
    <div className="form-container1">
      <BackButton />
      <h2>Detalle del Repuesto</h2>

      <div style={{ marginBottom: "10px" }}>
        <strong>Nombre:</strong> {repuestoDetalle.nombre}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Apellidos:</strong> {repuestoDetalle.apellidos}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Email:</strong> {repuestoDetalle.email}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Teléfono:</strong> {repuestoDetalle.telefono}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Dirección:</strong> {repuestoDetalle.direccion}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Repuesto:</strong> {repuestoDetalle.repuesto}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Fecha de Creación:</strong>{" "}
        {new Date(repuestoDetalle.createdAt).toLocaleString()}
      </div>
      <br />
      <div className="contactoDerivado">
        <h2>Derivado a:</h2>
        <p>
          <span>Nombre:</span> {repuestoDetalle.Usuario?.nombre}
        </p>
        <p>
          <span>Apellido:</span> {repuestoDetalle.Usuario?.apellido}
        </p>
        <p>
          <span>Email:</span>{" "}
          <a className="email" href="mailto:{repuestoDetalle.Usuario.email}">
            {repuestoDetalle.Usuario?.email}
          </a>
        </p>
      </div>
    </div>
  );
}
