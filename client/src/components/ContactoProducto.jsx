import React, { useState } from "react";
import { useContactoProducto } from "../hooks/useContactoProducto";
import { FaTimes } from "react-icons/fa";

export default function ContactoProducto({
  id,
  handleCerrarContactoProducto,
  familia,
  marca,
  modelo,
}) {
  const { mutate: contactoProducto } =
    useContactoProducto().contactoProductoMutation;

  const [formData, setFormData] = useState({
    idProducto: id,
    nombre: "",
    apellido: "",
    razonSocial: "",
    email: "",
    telefonoCelular: "",
    direccion: "",
    pagoContado: true,
    cuotas: 1,
    anticipo: 0,
    moneda: "USD",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    contactoProducto(formData);
    handleCerrarContactoProducto();
  };

  return (
    <div className="contact-container">
      <div>
        <button
          type="button"
          onClick={handleCerrarContactoProducto}
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
          <p className="text-muted" style={{ fontSize: "16px" }}>
            Consulte sobre {familia}, {marca}, {modelo} a través de nuestro
            formulario.
          </p>
          <p style={{ color: "grey", fontWeight: "bold", fontSize: "14px" }}>
            Un asesor de Ventas se contactará con usted de inmediato.
          </p>
        </div>
      </div>
      <div className="contact-content">
        <form
          onSubmit={handleSubmit}
          className="contact-form"
          style={{ marginTop: "-20px" }}
        >
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre: <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">
              Apellido: <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="razonSocial">
              Razón Social: <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              id="razonSocial"
              name="razonSocial"
              value={formData.razonSocial}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">
              Email: <span className="obligatorio">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefonoCelular">
              Teléfono:<span className="obligatorio">*</span>
            </label>
            <input
              type="tel"
              id="telefonoCelular"
              name="telefonoCelular"
              value={formData.telefonoCelular}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="direccion">Dirección:</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pagoContado">Contado:</label>
            <select
              style={{ height: "45px" }}
              id="pagoContado"
              name="pagoContado"
              value={formData.pagoContado}
              onChange={handleChange}
            >
              <option value={true}>Sí</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="cuotas">Cuotas:</label>
            <select
              style={{ height: "45px" }}
              id="cuotas"
              name="cuotas"
              value={formData.cuotas}
              onChange={handleChange}
            >
              {[...Array(12).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="anticipo">Anticipo:</label>
            <input
              type="number"
              id="anticipo"
              name="anticipo"
              value={formData.anticipo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="moneda">Moneda:</label>
            <select
              style={{ height: "45px" }}
              id="moneda"
              name="moneda"
              value={formData.moneda}
              onChange={handleChange}
            >
              <option value="USD">USD</option>
              <option value="$">$</option>
            </select>
          </div>
          <div
            className="form-actions"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "-10px",
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
