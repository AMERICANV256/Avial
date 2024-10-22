import React from "react";
import { useContacto } from "../../hooks/useContacto";
import { useParams } from "react-router-dom";
import BackButton from "../../UI/BackButton";

export default function ContactoDetail() {
  const { id } = useParams();
  const { data: contactoDetalle, isLoading } =
    useContacto(id).contactoQueryById;

  if (isLoading) {
    return <div className="loader">Loading...</div>;
  }
  return (
    <div className="form-container1">
      <BackButton />
      <h2>Detalle del Contacto</h2>

      <div style={{ marginBottom: "10px" }}>
        <strong>Nombre:</strong> {contactoDetalle.nombre}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Apellidos:</strong> {contactoDetalle.apellidos}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Email:</strong> {contactoDetalle.email}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Teléfono:</strong> {contactoDetalle.telefono}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Dirección:</strong> {contactoDetalle.direccion}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Consulta:</strong> {contactoDetalle.consulta}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Fecha de Creación:</strong>{" "}
        {new Date(contactoDetalle.createdAt).toLocaleString()}
      </div>
      <br />
      <div className="contactoDerivado">
        <h2>Derivado a:</h2>
        <p>
          <span>Nombre:</span> {contactoDetalle.Usuario?.nombre}
        </p>
        <p>
          <span>Apellido:</span> {contactoDetalle.Usuario?.apellido}
        </p>
        <p>
          <span>Email:</span>{" "}
          <a className="email" href="mailto:{contactoDetalle.Usuario.email}">
            {contactoDetalle.Usuario?.email}
          </a>
        </p>
      </div>
    </div>
  );
}
