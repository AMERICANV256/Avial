import React from "react";
import { useParams } from "react-router-dom";
import { useVentas } from "../../hooks/useCotizaciones";
import Spinner from "../../UI/Spinner";
import BackButton from "../../UI/BackButton";

export default function VentasDetail() {
  const { id } = useParams();
  const { data: VentaData, isLoading } = useVentas(null, id).ventasQueryDetalle;

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (!VentaData) {
    return <div>No se encontró la venta.</div>;
  }

  const mappedVentaData = {
    codigoCotizacion: VentaData.Cotizacione.codigoCotizacion,
    entregaTecnica: VentaData.Cotizacione.entregaTecnica,
    estado: VentaData.Cotizacione.estado,
    formaPago: VentaData.Cotizacione.formaPago,
    garantia: VentaData.Cotizacione.garantia,
    lugarEntrega: VentaData.Cotizacione.lugarEntrega,
    mantenimientoOferta: VentaData.Cotizacione.mantenimientoOferta,
    notasEmail: VentaData.Cotizacione.notasEmail,
    notasUsuario: VentaData.Cotizacione.notasUsuario,
    numeroCotizacion: VentaData.Cotizacione.numeroCotizacion,
    origenFabricacion: VentaData.Cotizacione.origenFabricacion,
    patentamiento: VentaData.Cotizacione.patentamiento,
    plazoEntrega: VentaData.Cotizacione.plazoEntrega,
    precio: VentaData.Cotizacione.precio,

    // Datos del cliente
    cliente: {
      nombre: VentaData.Cotizacione.Cliente.nombre,
      apellido: VentaData.Cotizacione.Cliente.apellido,
      mail: VentaData.Cotizacione.Cliente.mail,
    },
    // Datos del producto
    producto: {
      familia: VentaData.Cotizacione.Producto.familia,
      marca: VentaData.Cotizacione.Producto.marca,
      modelo: VentaData.Cotizacione.Producto.modelo,
    },
    // Datos del usuario (vendedor)
    usuario: {
      nombre: VentaData.Cotizacione.Usuario.nombre,
      apellido: VentaData.Cotizacione.Usuario.apellido,
      email: VentaData.Cotizacione.Usuario.email,
    },
  };

  return (
    <div className="postVentaContainer1">
      <BackButton />
      <h2 className="tituloCompo1">Detalle de la Venta</h2>
      <br />
      <div className="detail-section">
        <h4>Producto</h4>

        <div style={{ marginBottom: "10px" }}>
          <strong>Familia:</strong> {mappedVentaData.producto.familia}
        </div>
        <hr />
        <div style={{ marginBottom: "10px" }}>
          <strong>Marca:</strong> {mappedVentaData.producto.marca}
        </div>
        <hr />
        <div style={{ marginBottom: "10px" }}>
          <strong>Modelo:</strong> {mappedVentaData.producto.modelo}
        </div>
        <hr />
      </div>
      <div className="detail-section">
        <h4>Cliente</h4>
        <div style={{ marginBottom: "10px" }}>
          <strong>Nombre:</strong>{" "}
          {`${mappedVentaData.cliente.nombre} ${mappedVentaData.cliente.apellido}`}
        </div>
        <hr />
        <div style={{ marginBottom: "10px" }}>
          <strong>Email:</strong> {mappedVentaData.cliente.mail}
        </div>
        <hr />
      </div>
      <div className="detail-section">
        <h4>Vendedor</h4>
        <div style={{ marginBottom: "10px" }}>
          <strong>Nombre:</strong>{" "}
          {`${mappedVentaData.usuario.nombre} ${mappedVentaData.usuario.apellido}`}
        </div>
        <hr />
        <div style={{ marginBottom: "10px" }}>
          <strong>Email:</strong> {mappedVentaData.usuario.email}
        </div>
        <hr />
      </div>
      <br />
      <div className="detail-section">
        <h4>Detalles Financieros</h4>

        <div style={{ marginBottom: "10px" }}>
          <strong>Precio de Venta:</strong> {VentaData.moneda}{" "}
          {VentaData.precio}
        </div>
        <hr />
        <h4>Financiación:</h4>
        <div style={{ marginBottom: "10px" }}>
          <strong>Forma de Pago:</strong> {mappedVentaData.formaPago}
        </div>
        <hr />
        <div style={{ marginBottom: "10px" }}>
          <strong>Precio Final:</strong> {VentaData.moneda}{" "}
          {VentaData.PrecioFinal}
        </div>
        <hr />
        <div style={{ marginBottom: "10px" }}>
          {VentaData.cuotas} Pagos de {VentaData.moneda} {VentaData.cuotaValor}
        </div>
        <hr />

        <div style={{ marginBottom: "10px" }}>
          Anticipo: U$D {VentaData.anticipo}
        </div>
        <hr />
      </div>
      <br />
      <div className="detail-section">
        <h4>Información de la Venta</h4>
        <div style={{ marginBottom: "10px" }}>
          <strong>Fecha de Cotización:</strong>{" "}
          {new Date(VentaData.fechaDeCreacion).toLocaleDateString()}
        </div>
        {VentaData.fechaVenta && (
          <div style={{ marginBottom: "10px" }}>
            <strong>Fecha de Venta:</strong>{" "}
            {new Date(VentaData.fechaVenta).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
