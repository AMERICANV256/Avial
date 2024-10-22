import React from "react";
import { FaWhatsapp, FaPhoneSquareAlt, FaEnvelope } from "react-icons/fa";

export default function DatosContacto() {
  return (
    <div className="datosContacto">
      <div className="grupoContacto">
        <h3>Ventas</h3>
        <a target="_blank" rel="noopener noreferrer">
          <FaPhoneSquareAlt size={40} color="#FF7F50" />
          4748-5900
        </a>
        <a
          href="https://wa.me/1159249700"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp size={40} color="#25D366" />
          11 5924-9700
        </a>
      </div>
      <div className="grupoContacto">
        <h3>Post Venta</h3>
        <a target="_blank" rel="noopener noreferrer">
          <FaPhoneSquareAlt size={40} color="#FF7F50" />
          4748-5900
        </a>
        <a
          href="https://wa.me/1139284834"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp size={40} color="#25D366" />
          11 3928-4834
        </a>
        <a
          href="mailto:servicios@americanvial.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaEnvelope size={40} color="#808080" />
          servicios@americanvial.com
        </a>
      </div>
      <div className="grupoContacto">
        <h3>Repuestos</h3>
        <a target="_blank" rel="noopener noreferrer">
          <FaPhoneSquareAlt size={40} color="#FF7F50" />
          4748-5900
        </a>
        <a
          href="https://wa.me/1151469600"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp size={40} color="#25D366" />
          11 5146-9600
        </a>
        <a
          href="mailto:repuestos@americanvial.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaEnvelope size={40} color="#808080" />
          repuestos@americanvial.com
        </a>
      </div>
    </div>
  );
}
