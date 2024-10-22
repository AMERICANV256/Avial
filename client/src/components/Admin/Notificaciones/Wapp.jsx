import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import BackButton from "../../../UI/BackButton";

export default function Wapp() {
  const { auth } = useAuth();
  const telefonoVendedor = auth.telefono;
  const [mensaje, setMensaje] = useState(""); // Estado para el mensaje

  const sendWhatsAppMessage = () => {
    const message = encodeURIComponent(mensaje);
    // Crear un enlace para abrir WhatsApp Web
    const url = `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <div className="postVentaContainer">
      <BackButton />
      <h2 className="tituloCompo">Notificar por WhatsApp</h2>
      <br />
      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)} // Actualiza el mensaje
        placeholder="Escribe tu mensaje aquí..."
        rows="4"
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button
        onClick={sendWhatsAppMessage}
        disabled={!mensaje} // Deshabilitar si no hay mensaje
      >
        Enviar Mensaje por WhatsApp
      </button>
    </div>
  );
}
