import React from "react";
import marca1 from "../assets/img/marca2.png";

export default function Footer({
  handleMostrarModalAbout,
  handleMostrarModalContact,
}) {
  return (
    <div className="footer">
      <div className="footerSpan">
        <span className="spantitle">Colección</span>

        <button className="spanbody">Edición Limitada</button>
      </div>
      <div className="footerSpan">
        <span className="spantitle">Atención al cliente</span>
        <button onClick={handleMostrarModalContact} className="spanbody">
          Contacto
        </button>
      </div>
      <div className="footerSpan">
        <span className="spantitle">Institucional</span>
        <button onClick={handleMostrarModalAbout} className="spanbody">
          Sobre Nosotros
        </button>
      </div>
      <img src={marca1} className="footerImage" />
    </div>
  );
}
