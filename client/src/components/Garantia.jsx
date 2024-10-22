import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useGarantia } from "../hooks/useGarantia";

export default function Garantia({ handleCerrarModalGarantia }) {
  const { mutate: crearGarantia } = useGarantia().GarantiaMutation;

  const [formValues, setFormValues] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
    tipoDeMaquina: "",
    marca: "",
    modelo: "",
    numeroDeChasis: "",
    fechaEntregaDelEquipo: "",
    ubicacion: "",
    cantidadHorasHorometro: "",
    falla: "",
  });

  const labels = {
    nombre: "Nombre",
    apellido: "Apellido",
    empresa: "Empresa",
    email: "Email",
    telefono: "Teléfono",
    tipoDeMaquina: "Máquina",
    marca: "Marca",
    modelo: "Modelo",
    numeroDeChasis: "Nro de Chasis",
    fechaEntregaDelEquipo: "Fecha Entrega",
    ubicacion: "Ubicación",
    cantidadHorasHorometro: "Hs Horómetro",
    falla: "Falla",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    crearGarantia(formValues);
    handleCerrarModalGarantia();
  };

  return (
    <div className="contact-container">
      <div>
        <button
          type="button"
          onClick={handleCerrarModalGarantia}
          className="button-cerrar"
        >
          <FaTimes />
        </button>
      </div>
      <div>
        <h3>RECLAMO DE GARANTÍA</h3>

        <div>
          <p className="text-muted">
            Para realizar una solicitud de reparación por favor complete el
            siguiente formulario con todos los datos requeridos.
          </p>
          <p style={{ color: "grey", fontWeight: "bold" }}>
            Un asesor de postVenta se contactará con usted de inmediato.
          </p>
        </div>
      </div>

      <div className="contact-content">
        <form onSubmit={handleSubmit} className="contact-form">
          {Object.keys(formValues).map((key) => (
            <div key={key} className="form-group">
              <label htmlFor={key}>
                {labels[key]} <span className="obligatorio">*</span>
              </label>
              <input
                type={
                  key === "fechaEntregaDelEquipo"
                    ? "date"
                    : key === "email"
                    ? "email"
                    : key === "cantidadHorasHorometro"
                    ? "number"
                    : key === "falla"
                    ? "textarea"
                    : "text"
                }
                id={key}
                name={key}
                value={formValues[key]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div
            className="form-actions"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "-20px",
            }}
          >
            <button type="submit" className="submit-button">
              Enviar
            </button>
          </div>
        </form>
      </div>
      <br />
    </div>
  );
}
