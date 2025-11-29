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

  // Traducción de rol según tu lógica
  let tipoUsuarioLabel = "";
  if (usuariosDetail?.rol === true && usuariosDetail?.distribuidor === null) {
    tipoUsuarioLabel = "Administrador";
  }
  if (usuariosDetail?.rol === true && usuariosDetail?.distribuidor !== null) {
    tipoUsuarioLabel = "Gerente";
  }
  if (usuariosDetail?.rol === false && usuariosDetail?.distribuidor !== null) {
    tipoUsuarioLabel = "Vendedor";
  }

  // Distribuidor
  const distribuidorLabel =
    usuariosDetail?.distribuidor === 1
      ? "Buenos Aires"
      : usuariosDetail?.distribuidor === 2
      ? "Córdoba"
      : "—";

  // Activo
  const activoLabel = usuariosDetail?.activo ? "Activo" : "Super Administrador";

  // Baneado
  const baneadoLabel = usuariosDetail?.baneado ? "Sí" : "No";

  return (
    <div className="detalleUsuarioCard">
      <BackButton />
      <h3 className="detalleTitulo">Detalle del Usuario</h3>

      <div className="detalleItem">
        <span className="detalleLabel">Email:</span>
        <span className="detalleValue">{email}</span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Nombre:</span>
        <span className="detalleValue">{nombre}</span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Apellido:</span>
        <span className="detalleValue">{apellido}</span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Dirección:</span>
        <span className="detalleValue">{direccion}</span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Teléfono:</span>
        <span className="detalleValue">{telefono}</span>
      </div>
      <div className="detalleItem">
        <span className="detalleLabel">Tipo de Usuario:</span>
        <span className="detalleValue">{tipoUsuarioLabel}</span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Región:</span>
        <span className="detalleValue">{distribuidorLabel}</span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Estado:</span>
        <span className="detalleValue">{activoLabel}</span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Baneado:</span>
        <span className="detalleValue">{baneadoLabel}</span>
      </div>
      <div className="detalleItem">
        <span className="detalleLabel">Fecha de Registro:</span>
        <span className="detalleValue">
          {new Date(fechaDeRegistro).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
