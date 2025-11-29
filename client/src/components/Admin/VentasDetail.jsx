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
    <div className="detalleUsuarioCard">
      <BackButton />
      <h3 className="detalleTitulo">Detalle de la venta</h3>

      <div className="detail-section">
        <h4>Producto</h4>
        <div className="detalleItem">
          <span className="detalleLabel">Familia:</span>
          <span className="detalleValue">
            {mappedVentaData.producto.familia}
          </span>
        </div>
        <div className="detalleItem">
          <span className="detalleLabel">Marca:</span>
          <span className="detalleValue">{mappedVentaData.producto.marca}</span>
        </div>
        <div className="detalleItem">
          <span className="detalleLabel">Modelo:</span>
          <span className="detalleValue">
            {mappedVentaData.producto.modelo}
          </span>
        </div>
      </div>

      <div className="detail-section">
        <h4>Cliente</h4>
        <div className="detalleItem">
          <span className="detalleLabel">Nombre:</span>
          <span className="detalleValue">
            {`${mappedVentaData.cliente.nombre} ${mappedVentaData.cliente.apellido}`}
          </span>
        </div>
        <div className="detalleItem">
          <span className="detalleLabel">Email:</span>
          <span className="detalleValue">{mappedVentaData.cliente.mail}</span>
        </div>
      </div>

      <div className="detail-section">
        <h4>Vendedor</h4>
        <div className="detalleItem">
          <span className="detalleLabel">Nombre:</span>
          <span className="detalleValue">
            {`${mappedVentaData.usuario.nombre} ${mappedVentaData.usuario.apellido}`}
          </span>
        </div>
        <div className="detalleItem">
          <span className="detalleLabel">Email:</span>
          <span className="detalleValue">{mappedVentaData.usuario.email}</span>
        </div>
      </div>

      <div className="detail-section">
        <h4>Detalles Financieros</h4>
        <div className="detalleItem">
          <span className="detalleLabel">Precio de Venta:</span>
          <span className="detalleValue">
            {VentaData.moneda} {VentaData.precio}
          </span>
        </div>
        <h4>Financiación</h4>
        <div className="detalleItem">
          <span className="detalleLabel">Forma de Pago:</span>
          <span className="detalleValue">{mappedVentaData.formaPago}</span>
        </div>
        <div className="detalleItem">
          <span className="detalleLabel">Precio Final:</span>
          <span className="detalleValue">
            {VentaData.moneda} {VentaData.PrecioFinal}
          </span>
        </div>
        <div className="detalleItem">
          <span className="detalleLabel">Cuotas:</span>
          <span className="detalleValue">
            {VentaData.cuotas} pagos de {VentaData.moneda}{" "}
            {VentaData.cuotaValor}
          </span>
        </div>
        <div className="detalleItem">
          <span className="detalleLabel">Anticipo:</span>
          <span className="detalleValue">U$D {VentaData.anticipo}</span>
        </div>
      </div>

      <div className="detail-section">
        <h4>Información de la Venta</h4>
        <div className="detalleItem">
          <span className="detalleLabel">Fecha de Cotización:</span>
          <span className="detalleValue">
            {new Date(VentaData.fechaDeCreacion).toLocaleDateString()}
          </span>
        </div>
        {VentaData.fechaVenta && (
          <div className="detalleItem">
            <span className="detalleLabel">Fecha de Venta:</span>
            <span className="detalleValue">
              {new Date(VentaData.fechaVenta).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
