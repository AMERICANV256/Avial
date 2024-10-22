import React from "react";
import { useCotizaciones } from "../../hooks/useCotizaciones";
import { useCotizacionIndividual } from "../../hooks/useCotizacionIndividual";
import BackButton from "../../UI/BackButton";

export default function VentasAprobar() {
  const { data, isLoading } =
    useCotizaciones().CotizacionesPendientesDeAprobacion;

  const { mutate: estado2 } =
    useCotizacionIndividual().cotizacionMutationState2;

  return (
    <div className="ventasPendientes">
      <BackButton />
      <h2 className="tituloCompo1">Ventas Pendientes</h2> <br />
      {data && data.length > 0 ? (
        data.map((cotizacion) => (
          <div key={cotizacion.codigoCotizacion} className="cotizacion-general">
            <h3>
              Cotización General: {cotizacion.Cotizacione.codigoCotizacion}
            </h3>
            <p>
              Fecha de la Cotización:{" "}
              {new Date(
                cotizacion.Cotizacione.fechaDeCreacion
              ).toLocaleDateString()}
            </p>

            <div className="info-container">
              <div className="cliente-info-pendiente">
                <h4>Cliente</h4>
                <p>
                  Nombre:{" "}
                  {cotizacion.Cotizacione.Cliente?.nombre || "No disponible"}
                </p>
                <p>
                  Apellido:{" "}
                  {cotizacion.Cotizacione.Cliente?.apellido || "No disponible"}
                </p>
                <p>
                  Email:{" "}
                  {cotizacion.Cotizacione.Cliente?.mail || "No disponible"}
                </p>
              </div>

              {/* Mapeo de producto */}
              <div className="producto-info-pendiente">
                <h4>Producto</h4>
                <p>
                  Familia:{" "}
                  {cotizacion.Cotizacione.Producto?.familia || "No disponible"}
                </p>
                <p>
                  Marca:{" "}
                  {cotizacion.Cotizacione.Producto?.marca || "No disponible"}
                </p>
                <p>
                  Modelo:{" "}
                  {cotizacion.Cotizacione.Producto?.modelo || "No disponible"}
                </p>
              </div>

              {/* Mapeo de usuario */}
              <div className="usuario-info-pendiente">
                <h4>Vendedor</h4>
                <p>
                  Nombre:{" "}
                  {cotizacion.Cotizacione.Usuario?.nombre || "No disponible"}
                </p>
                <p>
                  Apellido:{" "}
                  {cotizacion.Cotizacione.Usuario?.apellido || "No disponible"}
                </p>
              </div>
            </div>
            <div className="precios-info-pendiente">
              <h4>Detalles de la Cotización</h4>
              <p>
                Precio de Venta: {cotizacion.moneda} {cotizacion.precio}
              </p>

              <p>
                {cotizacion.cuotas} Pagos de: {cotizacion.moneda}{" "}
                {cotizacion.cuotaValor}
              </p>
              <p>
                Anticipo: {cotizacion.moneda} {cotizacion.anticipo}
              </p>
              <p>Interés: {cotizacion.interes}%</p>
              <p>
                Saldo a Financiar: {cotizacion.moneda}{" "}
                {cotizacion.saldoAFinanciar}{" "}
              </p>
              <p>
                Precio Final: {cotizacion.moneda} {cotizacion.PrecioFinal}
              </p>
            </div>

            <div className="concrectarVenta">
              <button
                onClick={() => estado2({ id: cotizacion.id })}
                className="btn-concretar-venta"
              >
                Aprobar Venta
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No hay cotizaciones pendientes de aprobación.</p>
      )}
    </div>
  );
}
