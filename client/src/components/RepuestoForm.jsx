import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useRepuesto } from "../hooks/useRepuestos";

export default function RepuestoForm({ handleCerrarModalRepuesto }) {
  const { mutate: crearRepuesto } = useRepuesto().repuestoMutation;

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [repuesto, setRepuesto] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !nombre ||
      !apellidos ||
      !email ||
      !telefono ||
      !direccion ||
      !repuesto
    ) {
      alert("Por favor completa todos los campos del formulario.");
      return;
    }

    const formData = {
      nombre,
      apellidos,
      email,
      telefono,
      direccion,
      repuesto,
    };

    try {
      await crearRepuesto(formData);

      // Limpiar los campos del formulario después de enviar
      setNombre("");
      setApellidos("");
      setEmail("");
      setTelefono("");
      setDireccion("");
      setRepuesto("");

      handleCerrarModalRepuesto();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  return (
    <div className="contact-container">
      <div>
        <button
          type="button"
          onClick={handleCerrarModalRepuesto}
          className="button-cerrar"
        >
          <FaTimes />
        </button>
      </div>
      <div>
        <h3>Horario de Atención</h3>
        <h5>Lunes a Viernes 9 a 18 hs.</h5>
        <br />
        <div>
          <p className="text-muted">
            Consulte sobre nuestros Equipos y Servicios a través de nuestro
            formulario.
          </p>
          <p style={{ color: "grey", fontWeight: "bold" }}>
            Un asesor de Ventas se contactará con usted de inmediato.
          </p>
        </div>
      </div>

      <div className="contact-content">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre:<span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellidos">
              Apellidos:<span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">
              Email:<span className="obligatorio">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">
              Teléfono:<span className="obligatorio">*</span>
            </label>
            <input
              type="number"
              id="telefono"
              name="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="direccion">
              Dirección:<span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ width: "97%" }}>
            <label htmlFor="repuesto">
              Repuesto:<span className="obligatorio">*</span>
            </label>
            <textarea
              id="repuesto"
              name="repuesto"
              rows="4"
              value={repuesto}
              onChange={(e) => setRepuesto(e.target.value)}
              required
            ></textarea>
          </div>

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
