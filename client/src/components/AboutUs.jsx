import React from "react";
import about from "../assets/img/about.png";
import { FaTimes } from "react-icons/fa";

export default function AboutUs({ handleCerrarModalAbout }) {
  return (
    <div className="contact-container">
      <div className="about-button">
        <button onClick={handleCerrarModalAbout} className="button-cerrar">
          <FaTimes />
        </button>
      </div>
      <h4
        style={{
          fontWeight: "bold",
          textDecoration: "underline",
          textDecorationColor: "#febb00",
        }}
      >
        SOBRE NOSOTROS
      </h4>

      <img src={about} alt="" className="about-image" />

      <div className="about-content-margin" style={{ textAlign: "justify" }}>
        <span>
          Con mas 10 años de trayectoria, American vial es una empresa dedicada
          a prestar servicios de alquiler y venta de maquinaria para la
          construcción. En la actualidad American Vial es un referente
          indiscutido en el segmento de maquinas viales de origen Asia & Brasil.
        </span>
      </div>
      <br />
    </div>
  );
}
