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
            <label htmlFor="contraseña">Contraseña</label>
            <input type="password" name="password" onChange={changed} />
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
          {/* {loading && <p>Subiendo imagen...</p>}
          {producto.imagen && (
            <img
              src={producto.imagen}
              alt="Firma"
              style={{ width: "30%", height: "30%", marginTop: "10px" }}
            />
          )} */}
        </div>
        <input
          type="submit"
          value="Guardar Cambios"
          className="button-registro"
        />
      </form>
      <br />
      <span>
        {saved == "saved" ? "Usuario modificado Correctamente" : null}
      </span>
      <span>{saved == "error" ? "Error Interno del Servidor" : null}</span>
    </div>
  );
}
