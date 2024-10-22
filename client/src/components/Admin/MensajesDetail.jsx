import React from "react";
import { useMensajes } from "../../hooks/useMensajes";
import { useParams } from "react-router-dom";
import Spinner from "../../UI/Spinner";
import BackButton from "../../UI/BackButton";

export default function MensajesDetail() {
  const { id } = useParams();
  const { data: mensajesDetail, isLoading } = useMensajes(
    null,
    id
  ).MensajesDetailQuery;

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  const { Mensaje, fechaDeEnvio } = mensajesDetail.mensaje;

  return (
    <div className="form-container1">
      <BackButton />
      <h2>Detalles del Mensaje</h2>
      <br />
      <div>
        <strong>Fecha de Envío:</strong>{" "}
        {new Date(fechaDeEnvio).toLocaleString()}
      </div>
      <br />
      <div>
        <strong>Mensaje:</strong>
        <p>{Mensaje}</p>
      </div>
    </div>
  );
}
