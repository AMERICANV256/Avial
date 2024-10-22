import React from "react";
import { useGarantia } from "../../hooks/useGarantia";
import { useParams } from "react-router-dom";
import Spinner from "../../UI/Spinner";
import BackButton from "../../UI/BackButton";

export default function GarantiaDetail() {
  const { id } = useParams();
  const { data: garantiaData, isLoading } = useGarantia(id).garantiaQueryById;

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  const {
    nombre,
    apellido,
    empresa,
    email,
    telefono,
    tipoDeMaquina,
    marca,
    modelo,
    numeroDeChasis,
    fechaEntregaDelEquipo,
    ubicacion,
    cantidadHorasHorometro,
    falla,
  } = garantiaData;

  return (
    <div className="form-container1">
      <BackButton />
      <h3>Detalle de la Garantía</h3>
      <br />
      <div style={{ marginBottom: "10px" }}>
        <div style={{ marginBottom: "10px" }}>
          <strong>Nombre:</strong> {nombre}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Apellido:</strong> {apellido}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Empresa:</strong> {empresa}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Email:</strong> {email}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Teléfono:</strong> {telefono}
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Tipo de Máquina:</strong> {tipoDeMaquina}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Marca:</strong> {marca}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Modelo:</strong> {modelo}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Número de Chasis:</strong> {numeroDeChasis}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Fecha de Entrega del Equipo:</strong>{" "}
        {new Date(fechaEntregaDelEquipo).toLocaleDateString()}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Ubicación:</strong> {ubicacion}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Cantidad de Horas (Horómetro):</strong> {cantidadHorasHorometro}
      </div>
      <br />
      <h5>Detalle de la Falla</h5>
      <div style={{ marginBottom: "10px" }}>
        <p>{falla}</p>
      </div>

      <div className="contactoDerivado">
        <h2>Derivado a:</h2>
        <p>
          <span>Nombre:</span> {garantiaData.Usuario?.nombre}
        </p>
        <p>
          <span>Apellido:</span> {garantiaData.Usuario?.apellido}
        </p>
        <p>
          <span>Email:</span>{" "}
          <a className="email" href="mailto:{contactoDetalle.Usuario.email}">
            {garantiaData.Usuario?.email}
          </a>
        </p>
      </div>
    </div>
  );
}
