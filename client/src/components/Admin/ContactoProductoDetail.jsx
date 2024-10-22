import React from "react";
import { useContactoProducto } from "../../hooks/useContactoProducto";
import { useParams } from "react-router-dom";
import Spinner from "../../UI/Spinner";
import BackButton from "../../UI/BackButton";

export default function DescuentoDetail() {
  const { id } = useParams();
  const { data: descuentoDetalle, isLoading } =
    useContactoProducto(id).contactoProductoQueryById;

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  return (
    <div className="form-container1">
      <BackButton />
      <h3>Detalle del Contacto por Producto</h3>
      <div className="detalle-descuento">
        <br />
        <strong>Nombre Completo:</strong> {descuentoDetalle.nombre}{" "}
        {descuentoDetalle.apellido}
      </div>
      <div className="detalle-descuento">
        <strong>Razón Social:</strong> {descuentoDetalle.razonSocial}
      </div>
      <div className="detalle-descuento">
        <strong>Email:</strong> {descuentoDetalle.email}
      </div>
      <div className="detalle-descuento">
        <strong>Teléfono Celular:</strong> {descuentoDetalle.telefonoCelular}
      </div>
      <div className="detalle-descuento">
        <strong>Dirección:</strong> {descuentoDetalle.direccion}
      </div>
      <div className="detalle-descuento">
        <strong>Fecha de Registro:</strong>{" "}
        {new Date(descuentoDetalle.fechaDeRegistro).toLocaleString()}
      </div>
      <div className="detalle-descuento">
        <strong>Pago Contado:</strong> {descuentoDetalle.pagoContado}
      </div>
      <div className="detalle-descuento">
        <strong>Cuotas:</strong> {descuentoDetalle.cuotas}
      </div>
      <div className="detalle-descuento">
        <strong>Anticipo:</strong> {descuentoDetalle.anticipo}
      </div>
      <div className="detalle-descuento">
        <strong>Moneda:</strong> {descuentoDetalle.moneda}
      </div>
      <div className="detalle-descuento">
        <strong>Familia del Producto:</strong>{" "}
        {descuentoDetalle.Producto.familia}
      </div>
      <div className="detalle-descuento">
        <strong>Marca del Producto:</strong> {descuentoDetalle.Producto.marca}
      </div>
      <div className="detalle-descuento">
        <strong>Modelo del Producto:</strong> {descuentoDetalle.Producto.modelo}
      </div>

      <br />
      <div className="contactoDerivado">
        <h2>Derivado a:</h2>
        <p>
          <span>Nombre:</span> {descuentoDetalle.Usuario?.nombre}
        </p>
        <p>
          <span>Apellido:</span> {descuentoDetalle.Usuario?.apellido}
        </p>
        <p>
          <span>Email:</span>{" "}
          <a className="email" href="mailto:{contactoDetalle.Usuario.email}">
            {descuentoDetalle.Usuario?.email}
          </a>
        </p>
      </div>
    </div>
  );
}
