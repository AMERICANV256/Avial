import React, { useState, useEffect } from "react";
import { useForm } from "../../hooks/useForm";
import logo from "../../assets/img/welcomefondoblanco.png";

export default function Registro({ handleCerrarModalRegistro }) {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const saveUser = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    let newUser = { ...form, password };
    setErrorMessage("");

    const request = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}usuarios/registro`,
      {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    if (request.status === 400) {
      setSaved("400");
      return;
    }
    const data = await request.json();

    if (data.status === "success") {
      setSaved("saved");
      setShowWelcomeMessage(true);
    } else {
      setSaved("error");
    }
  };

  useEffect(() => {
    if (showWelcomeMessage) {
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false);
        handleCerrarModalRegistro();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showWelcomeMessage]);

  return (
    <div className="registro-container">
      <div className="button-close-login">
        <button onClick={handleCerrarModalRegistro} style={{ color: "black" }}>
          X
        </button>
      </div>

      <h4>Ingresá tus datos</h4>

      <br />
      <form className="registro" onSubmit={saveUser}>
        <div
          className="registroform"
          style={{ display: "block", justifyContent: "center" }}
        >
          <label
            style={{ display: "flex", justifyContent: "center" }}
            htmlFor="email"
          >
            Email<span className="required">*</span>
          </label>
          <input type="email" name="email" onChange={changed} required />
        </div>
        <div className="columna">
          <div className="registroform">
            <label htmlFor="contraseña">
              Contraseña<span className="required">*</span>
            </label>
            <input
              type="password"
              name="password"
              onChange={(e) => {
                changed(e);
                setPassword(e.target.value);
              }}
              required
            />
          </div>
          <div className="registroform">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" name="nombre" onChange={changed} />
          </div>
          <div className="registroform">
            <label htmlFor="direccion">Dirección</label>
            <input type="text" name="direccion" onChange={changed} />
          </div>
        </div>
        <div className="columna">
          <div className="registroform">
            <label htmlFor="confirmarContraseña">
              Repetir Contraseña<span className="required">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="registroform">
            <label htmlFor="apellidos">Apellidos</label>
            <input type="text" name="apellido" onChange={changed} />
          </div>
          <div className="registroform">
            <label htmlFor="telefono">Teléfono</label>
            <input type="number" name="telefono" onChange={changed} />
          </div>
        </div>

        {errorMessage && (
          <div className="error-message">
            <strong>{errorMessage}</strong>
          </div>
        )}
        {saved === "error" && (
          <div className="error-message">Error al registrarse</div>
        )}
        {saved === "400" && (
          <div className="error-message">
            El email ya se encuentra registrado
          </div>
        )}

        <input type="submit" value="Registrate" className="button-registro" />
      </form>
      <br />
      {showWelcomeMessage && (
        <div className="welcome-message">
          <img src={logo} alt="Logo" />
          <p>Ya estás registrado en AMERICAN VIAL!</p>
        </div>
      )}
    </div>
  );
}
