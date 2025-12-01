import React, { useState, useEffect } from "react";
import { useForm } from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";

import BackButton from "../../UI/BackButton";
import Select from "react-select";
import { useUsuario } from "../../hooks/useUsuarios";
import { useParams } from "react-router-dom";

const Clouddinary = import.meta.env.VITE_CLOUDINARY_URL;

export default function UsuariosPost() {
  const { id } = useParams();
  const { data: usuariosDetail, isLoading } = useUsuario(id).UsuarioDetailQuery;

  const { form, changed, setForm } = useForm({});
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

  useEffect(() => {
    if (usuariosDetail && Object.keys(form).length === 0) {
      setForm(usuariosDetail);

      let tipo = "";

      // ADMIN
      if (usuariosDetail.rol === true && usuariosDetail.distribuidor === null) {
        tipo = "admin";
      }

      // GERENTE / DISTRIBUIDOR
      if (usuariosDetail.rol === true && usuariosDetail.distribuidor !== null) {
        tipo = "distribuidor";
      }

      // VENDEDOR
      if (
        usuariosDetail.rol === false &&
        usuariosDetail.distribuidor !== null
      ) {
        tipo = "vendedor";
      }

      setTipoUsuario(tipo);
    }
  }, [usuariosDetail]);

  useEffect(() => {
    if (tipoUsuario === "admin") {
      setForm((prev) => ({ ...prev, distribuidor: null, rol: true }));
    }
  }, [tipoUsuario]);

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
    console.log("Archivo seleccionado:", file);
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

      changed({ target: { name: "firma", value: imageData.secure_url } });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    let newUser = { ...form };

    newUser.id = usuariosDetail.id;
    newUser.firma = form.firma;

    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}usuarios`,
        {
          method: "PUT",
          body: JSON.stringify(newUser),
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const response = await request.json();

      if (response.status === "success") {
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

  const filteredActivoOptions =
    tipoUsuario === "admin"
      ? activoOptions
      : activoOptions.filter((opt) => opt.value === true);

  return (
    <div className="postVentaContainer">
      <BackButton />
      <div className="datos">
        <h4>
          Modificando los datos del Usuario {form?.nombre} {form?.apellido}
        </h4>
      </div>
      <br />
      <form className="registro" onSubmit={saveUser}>
        <div className="columna">
          <input
            type="text"
            name="id"
            hidden
            defaultValue={usuariosDetail?.id}
          />

          <div className="registroform">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              onChange={changed}
              disabled
              value={form.email || ""}
            />
          </div>

          <div className="registroform">
            <label htmlFor="currentPassword">Contraseña actual</label>
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
            <label htmlFor="newPassword">Nueva contraseña</label>
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
            <label htmlFor="confirmPassword">Repetir nueva contraseña</label>
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
              value={form.nombre || ""}
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
              value={form.apellido || ""}
            />
          </div>
          <div className="registroform">
            <label htmlFor="telefono">Teléfono </label>
            <input
              type="text"
              name="telefono"
              onChange={changed}
              value={form.telefono || ""}
            />
          </div>
          <div className="registroform">
            <label htmlFor="direccion">Dirección</label>
            <input
              type="text"
              name="direccion"
              onChange={changed}
              value={form.direccion || ""}
            />
          </div>
          <br />
          <div className="registroform">
            <label htmlFor="tipoUsuario">
              Tipo de Usuario <span className="requiredRed">*</span>
            </label>
            <Select
              placeholder="Seleccionar"
              options={tipoUsuarioOptions}
              value={
                tipoUsuarioOptions.find((opt) => opt.value === tipoUsuario) ||
                null
              }
              onChange={(option) => {
                const value = option.value;
                setTipoUsuario(value);

                if (value === "admin") {
                  // Admin → rol true + distribuidor null
                  changed({
                    target: {
                      name: "rol",
                      value: true,
                    },
                  });
                  changed({
                    target: {
                      name: "distribuidor",
                      value: null,
                    },
                  });
                }

                if (value === "distribuidor") {
                  // Gerente → rol true
                  changed({
                    target: {
                      name: "rol",
                      value: true,
                    },
                  });
                }

                if (value === "vendedor") {
                  // Vendedor → rol false
                  changed({
                    target: {
                      name: "rol",
                      value: false,
                    },
                  });
                }
              }}
            />
          </div>
          <br />
          {(tipoUsuario === "distribuidor" || tipoUsuario === "vendedor") && (
            <div className="registroform">
              <label htmlFor="tipoUsuario">
                Región <span className="requiredRed">*</span>
              </label>
              <Select
                options={distribuidorOptions}
                value={
                  distribuidorOptions.find(
                    (opt) => opt.value === form?.distribuidor
                  ) || null
                }
                onChange={(option) => {
                  changed({
                    target: {
                      name: "distribuidor",
                      value: option ? option.value : null,
                    },
                  });
                }}
                placeholder="Selecciona región"
              />
            </div>
          )}
          <br />
          <div className="registroform">
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
            />
          </div>
        </div>
        <div
          className="registroform"
          style={{
            width: "100%",
            marginTop: "10px",
          }}
        >
          <h6 style={{ color: "black", textAlign: "center" }}>Firma</h6>
          {usuariosDetail?.firma && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <img
                src={form.firma || usuariosDetail.firma}
                alt="Firma del usuario"
                style={{
                  maxWidth: "200px",
                  display: "block",
                  marginTop: "8px",
                }}
              />
            </div>
          )}

          <input
            style={{ width: "100%", textAlign: "center", marginTop: "10px" }}
            type="file"
            name="firma"
            placeholder="AGREGAR FIRMA"
            onChange={uploadImage}
          />
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <input
            type="submit"
            value="Guardar Cambios"
            className="button-centrado"
          />
        </div>
      </form>

      <br />
      <span style={{ color: "green" }}>
        {saved === "saved" ? "Usuario modificado Corréctamente" : null}
      </span>

      {saved === "error" && (
        <span style={{ color: "red" }}>{errorMessage}</span>
      )}
    </div>
  );
}
