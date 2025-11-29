import React from "react";
import { useClientes } from "../../hooks/useClientes";
import { useParams } from "react-router-dom";
import Spinner from "../../UI/Spinner";
import BackButton from "../../UI/BackButton";

export default function ClientesDetail() {
  const { id } = useParams();
  const { data: clienteDetalle, isLoading } = useClientes(
    null,
    id
  ).clientesQueryDetalle;

  if (isLoading) {
    return (
      <div>
        {" "}
        <Spinner />
      </div>
    );
  }

  const {
    CUIT,
    domicilio,
    nombre,
    apellido,
    mail,
    telefono,
    fechaDeCreacion,
    fechaModi,
    Usuario,
    razonSocial,
    mailAlternativo,
    mailAlternativo1,
    telefonoAlternativo,
    telefonoAlternativo1,
    contactoAlternativo,
    contactoAlternativo1,
    provincia,
    ciudad,
  } = clienteDetalle;

  return (
    <div className="detalleUsuarioCard">
      <BackButton />
      <h3 className="detalleTitulo">Detalle del Cliente</h3>

      <div className="detalleItem">
        <span className="detalleLabel">CUIT:</span>
        <span className="detalleValue">{CUIT}</span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Razón Social:</span>
        <span className="detalleValue">{razonSocial}</span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Domicilio:</span>
        <span className="detalleValue">{domicilio}</span>
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
        <span className="detalleLabel">Email:</span>
        <span className="detalleValue">{mail}</span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Teléfono:</span>
        <span className="detalleValue">{telefono}</span>
      </div>

      {contactoAlternativo && (
        <div className="detalleItem">
          <span className="detalleLabel">Contacto Alternativo:</span>
          <span className="detalleValue">{contactoAlternativo}</span>
        </div>
      )}

      {mailAlternativo && (
        <div className="detalleItem">
          <span className="detalleLabel">Email Alternativo:</span>
          <span className="detalleValue">{mailAlternativo}</span>
        </div>
      )}

      {telefonoAlternativo && (
        <div className="detalleItem">
          <span className="detalleLabel">Teléfono Alternativo:</span>
          <span className="detalleValue">{telefonoAlternativo}</span>
        </div>
      )}

      {contactoAlternativo1 && (
        <div className="detalleItem">
          <span className="detalleLabel">Contacto Alternativo:</span>
          <span className="detalleValue">{contactoAlternativo1}</span>
        </div>
      )}

      {mailAlternativo1 && (
        <div className="detalleItem">
          <span className="detalleLabel">Email Alternativo:</span>
          <span className="detalleValue">{mailAlternativo1}</span>
        </div>
      )}

      {telefonoAlternativo1 && (
        <div className="detalleItem">
          <span className="detalleLabel">Teléfono Alternativo:</span>
          <span className="detalleValue">{telefonoAlternativo1}</span>
        </div>
      )}

      <div className="detalleItem">
        <span className="detalleLabel">Provincia:</span>
        <span className="detalleValue">{provincia}</span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Ciudad:</span>
        <span className="detalleValue">{ciudad}</span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Creado:</span>
        <span className="detalleValue">
          {new Date(fechaDeCreacion).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Cargado por:</span>
        <span className="detalleValue">
          {Usuario.nombre} {Usuario.apellido}
        </span>
      </div>

      <div className="detalleItem">
        <span className="detalleLabel">Modificado:</span>
        <span className="detalleValue">
          {fechaModi
            ? new Date(fechaModi).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Sin modificaciones"}
        </span>
      </div>
    </div>
  );
}
