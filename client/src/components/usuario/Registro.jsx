import React, { useState, useEffect } from "react";
import { useForm } from "../../hooks/useForm";
import logo from "../../assets/img/welcomefondoblanco.png";
import BackButton from "../../UI/BackButton";
import Select from "react-select";
import Spinner from "../../UI/Spinner";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const navigate = useNavigate();

  // Opciones de tipo de usuario
  const tipoUsuarioOptions = [
    { value: "admin", label: "Administrador" },
    { value: "distribuidor", label: "Gerente" },
    { value: "vendedor", label: "Vendedor" },
  ];

  // Opciones de distribuidor/región
  const distribuidorOptions = [
    { value: 1, label: "Buenos Aires" },
    { value: 2, label: "Córdoba" },
  ];

  const activoOptions = [
    { value: true, label: "Activo" },
    { value: false, label: "SuperAdmin" },
  ];

  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [distribuidor, setDistribuidor] = useState(null);

  const saveUser = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    let newUser = { ...form, password, rol, distribuidor };
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
        navigate("/admin/Usuarios");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showWelcomeMessage]);

  const isFormValid =
    form.email &&
    password &&
    confirmPassword &&
    form.nombre &&
    form.apellido &&
    tipoUsuario;

  const filteredActivoOptions =
    tipoUsuario === "admin"
      ? activoOptions
      : activoOptions.filter((opt) => opt.value === true);

  return (
    <div className="postVentaContainer">
      <BackButton />

      <h3 className="tituloCompo">Ingresá los datos del Usuario</h3>

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
            Email<span className="requiredRed">*</span>
          </label>
          <input type="email" name="email" onChange={changed} required />
        </div>
        <div className="columna">
          <div className="registroform">
            <label htmlFor="contraseña">
              Contraseña<span className="requiredRed">*</span>
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
            <label htmlFor="nombre">
              Nombre<span className="requiredRed">*</span>
            </label>
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
              Repetir Contraseña<span className="requiredRed">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="registroform">
            <label htmlFor="apellidos">
              Apellidos <span className="requiredRed">*</span>
            </label>
            <input type="text" name="apellido" onChange={changed} />
          </div>
          <div className="registroform">
            <label htmlFor="telefono">Teléfono</label>
            <input type="number" name="telefono" onChange={changed} />
          </div>
        </div>

        <div
          className="registroform"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <label htmlFor="tipoUsuario">
            Tipo de Usuario<span className="requiredRed">*</span>
          </label>
          <br />
          <br />
          <Select
            options={tipoUsuarioOptions}
            onChange={(option) => {
              setTipoUsuario(option.value);

              if (option.value === "admin") {
                setRol(true);
                setDistribuidor(null);
                changed({ target: { name: "rol", value: true } });
                changed({ target: { name: "distribuidor", value: null } });
              }

              if (option.value === "distribuidor") {
                setRol(true);
                setDistribuidor(null);
                changed({ target: { name: "rol", value: true } });
              }

              if (option.value === "vendedor") {
                setRol(false);
                setDistribuidor(null);
                changed({ target: { name: "rol", value: false } });
              }
            }}
            placeholder="Selecciona el tipo de usuario"
            className="select-activo"
          />
        </div>

        {(tipoUsuario === "distribuidor" || tipoUsuario === "vendedor") && (
          <div
            className="registroform"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <label htmlFor="distribuidor">Región</label>
            <Select
              options={distribuidorOptions}
              onChange={(option) => {
                setDistribuidor(option.value);
                changed({
                  target: { name: "distribuidor", value: option.value },
                });
              }}
              placeholder="Selecciona la región"
              className="select-activo"
            />
          </div>
        )}

        <div
          className="registroform"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <label htmlFor="activo">
            Estado <span className="requiredRed">*</span>
          </label>
          <Select
            options={filteredActivoOptions}
            value={filteredActivoOptions.find(
              (opt) => opt.value === form?.activo
            )}
            onChange={(option) => {
              changed({ target: { name: "activo", value: option.value } });
            }}
            placeholder="Selecciona estado"
            className="select-activo"
          />
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

        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <input
            type="submit"
            value="Registrar Usuario"
            className="button-centrado"
            disabled={!isFormValid}
          />
        </div>
      </form>
      <br />
      {showWelcomeMessage && (
        <div className="welcome-message">
          <img src={logo} alt="Logo" />
          <p>Usuario registrado en AMERICAN VIAL!</p>
        </div>
      )}
    </div>
  );
}
