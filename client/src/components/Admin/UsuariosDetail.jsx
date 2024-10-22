import React from "react";
import { useParams } from "react-router-dom";
import { useUsuario } from "../../hooks/useUsuarios";
import Spinner from "../../UI/Spinner";
import BackButton from "../../UI/BackButton";

export default function UsuariosDetail() {
  const { id } = useParams();

  const { data: usuariosDetail, isLoading } = useUsuario(id).UsuarioDetailQuery;

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  const { email, nombre, apellido, direccion, telefono, fechaDeRegistro } =
    usuariosDetail;

  return (
    <div className="postVentaContainer1">
      <BackButton />
      <h2
        className="tituloCompo"
        style={{ display: "flex", justifyContent: "center" }}
      >
        Detalle del Usuario
      </h2>
      <br />
      <div>
        <strong>Email:</strong> {email}
      </div>
      <hr />
      <br />
      <div>
        <strong>Nombre:</strong> {nombre}
      </div>
      <hr />
      <br />
      <div>
        <strong>Apellido:</strong> {apellido}
      </div>
      <hr />
      <br />
      <div>
        <strong>Dirección:</strong> {direccion}
      </div>
      <hr />
      <br />
      <div>
        <strong>Teléfono:</strong> {telefono}
      </div>
      <hr />
      <br />
      <div>
        <strong>Fecha de Registro:</strong>{" "}
        {new Date(fechaDeRegistro).toLocaleDateString()}
      </div>
      <hr />
    </div>
  );
}
