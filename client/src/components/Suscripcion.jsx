import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useSuscriptores } from "../hooks/useSuscriptores";

export default function Suscripcion({ onClose }) {
  const { mutate: createSuscripcion } = useSuscriptores().suscripcionMutation;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Por favor, ingresa un email válido.");
      return;
    }

    createSuscripcion({ email });

    setEmail("");
    setError("");

    onClose();
  };

  return (
    <div className="suscripcion-container">
      <div className="suscripcion-content">
        <FaTimes className="suscripcion-close" onClick={onClose} />
        <h2>¡Suscríbete a nuestro boletín!</h2>
        <p>
          Recibe las últimas noticias y ofertas directamente en tu bandeja de
          entrada.
        </p>
        <form onSubmit={handleSubmit} className="suscripcion-form">
          <input
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Suscribirse</button>
        </form>
      </div>
    </div>
  );
}
