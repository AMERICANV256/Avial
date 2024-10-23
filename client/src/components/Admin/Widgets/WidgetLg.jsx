import React, { useState, useEffect } from "react";
import { useUltimasCotizaciones } from "../../../hooks/useCotizaciones";
import useAuth from "../../../hooks/useAuth";
import Spinner from "../../../UI/Spinner";

export default function WidgetLg() {
  const { auth } = useAuth();
  const token = localStorage.getItem("token");
  const idUsuario = token;

  const { data, isLoading } =
    useUltimasCotizaciones(idUsuario).ultimasCotizacionesQuery;

  console.log(data);

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="userListContainer">
      <span>Últimas cotizaciones realizadas</span>
      <br />
      <table className="table table-striped table-dark">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Modelo</th>
            <th>Moneda</th>
            <th>Precio Final</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data?.cotizaciones) &&
            data.cotizaciones
              .reduce((acc, cotizacion) => {
                const cotizacionesConIndividuals =
                  cotizacion.CotizacionIndividuals.map((individual, index) => ({
                    cotizacion,
                    individual,
                    index,
                  }));
                return acc.concat(cotizacionesConIndividuals);
              }, [])
              .slice(0, 5)
              .map(({ cotizacion, individual, index }) => (
                <tr key={`${cotizacion.id}-${index}`}>
                  <td>
                    {cotizacion.Cliente.nombre} {cotizacion.Cliente.apellido}
                  </td>
                  <td>{cotizacion.Producto.modelo}</td>
                  <td>U$D</td>
                  <td>{individual.PrecioFinal}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
