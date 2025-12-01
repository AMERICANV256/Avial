import React, { useState, useEffect } from "react";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";

const Clouddinary = import.meta.env.VITE_CLOUDINARY_URL;

export default function EditarUsuario({ handleCerrarModalEdit }) {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");
  const { auth, setAuth } = useAuth();

  const [loading, setLoading] = useState(false);
  const [producto, setProducto] = useState({ imagen: "" });

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

      changed({ target: { name: "firma", value: imageData.secure_url } });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    let newUser = form;

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
        const updatedUser = { ...auth, ...newUser };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        setAuth(updatedUser);
        setSaved("saved");
      } else {
        setSaved("error");
        console.error("Error en la respuesta del servidor:", response);
      }
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      setSaved("error");
    }
  };

  return (
    <div className="registro-container">
      <div className="button-close-login">
        <button onClick={handleCerrarModalEdit} style={{ color: "black" }}>
          X
        </button>
      </div>
      <div className="datos">
        <h4>Modificá tus datos</h4>
      </div>
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
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              name="nombre"
              onChange={changed}
              placeholder={auth.nombre}
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
        </div>
        <div className="columna">
          <div className="registroform">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              type="text"
              name="apellido"
              onChange={changed}
              placeholder={auth.apellido}
            />
          </div>
          <div className="registroform">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="text"
              name="telefono"
              onChange={changed}
              placeholder={auth.telefono}
            />
          </div>
          <div
            className="registroform"
            style={{ width: "100%", marginTop: "10px" }}
          >
            <h6 style={{ color: "black", textAlign: "center" }}>
              Firma actual
            </h6>

            {auth?.firma && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={auth.firma}
                  alt="Firma del usuario"
                  style={{
                    width: "80px",
                    height: "50px",
                    marginTop: "8px",
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <span
          style={{ color: "black", marginLeft: "10px", marginRight: "10px" }}
        >
          <strong>Firma</strong>
        </span>
        <input
          type="file"
          className="d-block"
          name="firma"
          placeholder="AGREGAR FIRMA"
          onChange={uploadImage}
        />

        <input
          type="submit"
          value="Guardar Cambios"
          className="button-registro"
        />
      </form>
      <br />
      <span style={{ color: "green" }}>
        {saved == "saved" ? "Usuario modificado Correctamente" : null}
      </span>
      <span>{saved == "error" ? "Error Interno del Servidor" : null}</span>
    </div>
  );
}
