// src/components/FormMensaje.js
import React, { useState } from "react";
import { useMensajes } from "../../hooks/useMensajes";
import useAuth from "../../hooks/useAuth";
import Select from "react-select";
import { useUsuario } from "../../hooks/useUsuarios";
import Swal from "sweetalert2";
import BackButton from "../../UI/BackButton";

export default function FormMensaje() {
  const { auth } = useAuth();
  const token = localStorage.getItem("token");
  const idUsuario = token;
  const { mutate: crearMensaje } = useMensajes().mensajesMutation;
  const { data, isLoading } = useUsuario().usuariosMensajesQuery;
  const [key, setKey] = useState(0);

  const [formData, setFormData] = useState({
    idUsuario: idUsuario,
    idDestino: "",
    Mensaje: "",
  });

  const userOptions = data?.allUsers.map((user) => ({
    value: user.id,
    label: `${user.nombre} ${user.apellido} (${user.email})`,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, idDestino: selectedOption.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    crearMensaje(formData, {
      onSuccess: () => {
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Tu mensaje se envió corréctamente",
          showConfirmButton: false,
          timer: 2000,
          background: "#ffffff",
          iconColor: "#ffc107",
          customClass: {
            title: "text-dark",
          },
        });
        setFormData({
          idUsuario: idUsuario,
          idDestino: "",
          Mensaje: "",
        });
        setKey((prevKey) => prevKey + 1);
      },
      onError: (error) => {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              Swal.fire({
                position: "center",
                icon: "info",
                title: "No se pudo enviar el mensaje. Intente más tarde",
                background: "#ffffff",
                iconColor: "#ffc107",
                customClass: {
                  title: "text-dark",
                },
                showConfirmButton: false,
                timer: 5000,
              });
              break;

            default:
              Swal.fire({
                position: "center",
                icon: "info",
                title: "Ocurrió un error inesperado, intente más tarde",
                background: "#ffffff",
                iconColor: "#dc3545",
                customClass: {
                  title: "text-dark",
                },
                showConfirmButton: false,
                timer: 5000,
              });
              break;
          }
        }
        setFormData({
          idUsuario: idUsuario,
          idDestino: "",
          Mensaje: "",
        });
        setKey((prevKey) => prevKey + 1);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container1">
      <BackButton />
      <h2 className="tituloCompo">Crear Mensaje</h2> <br />
      <div className="form-group">
        <label htmlFor="idDestino">Destinatario</label>
        <Select
          key={key}
          id="idDestino"
          name="idDestino"
          options={userOptions}
          onChange={handleSelectChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="Mensaje">Mensaje</label>
        <textarea
          id="Mensaje"
          name="Mensaje"
          value={formData.Mensaje}
          onChange={handleChange}
          className="form-control"
          rows="4"
          required
        />
      </div>
      <button type="submit" className="form-submit">
        Enviar Mensaje
      </button>
    </form>
  );
}
