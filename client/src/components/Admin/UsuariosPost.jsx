import React, { useState, useEffect } from "react";
import { useForm } from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
import BackButton from "../../UI/BackButton";
import Select from "react-select";

export default function UsuariosPost() {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");
  const { auth, setAuth } = useAuth();
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [distribuidor, setDistribuidor] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [producto, setProducto] = useState({ imagen: "" });

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

  const uploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Images");

    try {
      const res = await fetch(Clouddinary, {
        method: "POST",
        body: data,
      });

      const imageData = await res.json();
      setProducto({ ...producto, imagen: imageData.secure_url });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    let newUser = form;

    // Asegúrate de que no estás estableciendo el id en el frontend
    // Si el id no está en el localStorage, no lo necesitas aquí
    newUser.firma = producto.imagen; // Asegúrate de que la imagen está asignada correctamente

    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}usuarios`,
        {
          method: "PUT",
          body: JSON.stringify(newUser), // no se está enviando el id
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.getItem("token"), // Pasar el token en el header
          },
        }
      );

      const response = await request.json();

      if (response.status === "success") {
        const updatedUser = { ...auth, ...newUser };

        // Actualizar el objeto en el localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Actualizar el estado local
        setAuth(updatedUser);
        setSaved("saved");
        setErrorMessage("");
      } else {
        setSaved("error");
        setErrorMessage(response.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      setSaved("error");
      setErrorMessage("Error interno del servidor");
    }
  };

  return (
    <div className="postVentaContainer">
      <BackButton />
      <div className="datos">
        <h4>
          Modificando los datos del Usuario {auth.nombre} {auth.apellido}
        </h4>
      </div>
      <br />
      <form className="registro" onSubmit={saveUser}>
        <div className="columna">
          <input type="text" name="id" hidden defaultValue={auth.id} />

          <div className="registroform">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              onChange={changed}
              placeholder={auth.email}
              disabled
            />
          </div>

          <div className="registroform">
            <label htmlFor="currentPassword">
              Contraseña actual <span className="requiredRed">*</span>
            </label>
            <div className="password-input">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  changed({
                    target: { name: "currentPassword", value: e.target.value },
                  });
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowCurrent((v) => !v)}
                aria-label="Mostrar/Ocultar contraseña actual"
              >
                {showCurrent ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="registroform">
            <label htmlFor="newPassword">
              Nueva contraseña <span className="requiredRed">*</span>
            </label>
            <div className="password-input">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  changed({
                    target: { name: "newPassword", value: e.target.value },
                  });
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowNew((v) => !v)}
                aria-label="Mostrar/Ocultar nueva contraseña"
              >
                {showNew ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="registroform">
            <label htmlFor="confirmPassword">
              Repetir nueva contraseña <span className="requiredRed">*</span>
            </label>
            <div className="password-input">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  changed({
                    target: { name: "confirmPassword", value: e.target.value },
                  });
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label="Mostrar/Ocultar confirmación"
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="registroform">
            <label htmlFor="nombre">
              Nombre <span className="requiredRed">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              onChange={changed}
              placeholder={auth.nombre}
            />
          </div>
        </div>
        <div className="columna">
          <div className="registroform">
            <label htmlFor="apellidos">
              Apellidos <span className="requiredRed">*</span>
            </label>
            <input
              type="text"
              name="apellido"
              onChange={changed}
              placeholder={auth.apellido}
            />
          </div>
          <div className="registroform">
            <label htmlFor="telefono">Teléfono </label>
            <input
              type="text"
              name="telefono"
              onChange={changed}
              placeholder={auth.telefono}
            />
          </div>
          <div className="registroform">
            <label htmlFor="direccion">Dirección</label>
            <input
              type="text"
              name="direccion"
              onChange={changed}
              placeholder={auth.direccion}
            />
          </div>

          <div className="registroform">
            <label htmlFor="tipoUsuario">
              Tipo de Usuario <span className="requiredRed">*</span>
            </label>
            <Select
              options={tipoUsuarioOptions}
              defaultValue={tipoUsuarioOptions.find((opt) =>
                auth.rol === true && !auth.distribuidor
                  ? opt.value === "admin"
                  : auth.rol === true && auth.distribuidor
                  ? opt.value === "distribuidor"
                  : auth.rol === false
                  ? opt.value === "vendedor"
                  : null
              )}
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
            />
          </div>
          {(tipoUsuario === "distribuidor" || tipoUsuario === "vendedor") && (
            <div className="registroform">
              <label htmlFor="distribuidor">Región</label>
              <Select
                options={distribuidorOptions}
                defaultValue={distribuidorOptions.find(
                  (opt) => opt.value === auth.distribuidor
                )}
                onChange={(option) => {
                  setDistribuidor(option.value);
                  changed({
                    target: { name: "distribuidor", value: option.value },
                  });
                }}
              />
            </div>
          )}

          <div className="registroform">
            <label htmlFor="activo">
              Estado <span className="requiredRed">*</span>
            </label>
            <Select
              options={activoOptions}
              defaultValue={activoOptions.find(
                (opt) => opt.value === auth.activo
              )}
              onChange={(option) => {
                changed({ target: { name: "activo", value: option.value } });
              }}
              placeholder="Selecciona estado"
            />
          </div>
        </div>
        <div
          className="registroform"
          style={{ width: "100%", marginTop: "10px" }}
        >
          <h6 style={{ color: "black" }}>Adjuntar Firma</h6>
          <input
            style={{ width: "100%", textAlign: "center" }}
            type="file"
            name="Agregar Firma"
            placeholder="AGREGAR FIRMA"
            onChange={uploadImage}
          />
        </div>
        <input
          type="submit"
          value="Guardar Cambios"
          className="button-registro"
        />
      </form>

      <br />
      <span style={{ color: "green" }}>
        {saved === "saved" ? "Usuario modificado Correctamente" : null}
      </span>

      {saved === "error" && (
        <span style={{ color: "red" }}>{errorMessage}</span>
      )}
    </div>
  );
}
