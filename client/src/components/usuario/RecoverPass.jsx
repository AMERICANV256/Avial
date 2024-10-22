import React, { useState } from "react";

const RecoverPass = ({ handleCerrarModalRecover }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetPassword = async (email) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}usuarios/recoverpass`,
        {
          method: "PUT",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(
          "Contraseña restablecida con éxito, te enviamos un email!"
        );
      } else {
        setErrorMessage(
          `Error al restablecer la contraseña, intentálo más tarde`
        );
      }
    } catch (error) {
      setErrorMessage("Error de red: inténtalo más tarde");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    await resetPassword(email);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="registro-container">
      <div className="button-close-login">
        <button onClick={handleCerrarModalRecover} style={{ color: "black" }}>
          X
        </button>
      </div>
      <h3 className="spanemail">Ingresá tu Email</h3>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit} className="formrecover">
        <input
          className="recover"
          type="email"
          value={email}
          onChange={handleChangeEmail}
          placeholder="Ingresa tu correo electrónico"
          required
        />
        <button className="button-registro" type="submit">
          Restablecer contraseña
        </button>
      </form>
    </div>
  );
};

export default RecoverPass;
