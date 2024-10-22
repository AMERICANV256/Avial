import React, { useState, useEffect } from "react";
import { useInfoHomeAdmin } from "../../../hooks/useCotizaciones";
import useAuth from "../../../hooks/useAuth";
import Spinner from "../../../UI/Spinner";

export default function FeaturedInfo() {
  const { auth } = useAuth();
  const token = localStorage.getItem("token");
  const idUsuario = token;

  const { data, isLoading } = useInfoHomeAdmin(idUsuario).infoAdminQuery;

  if (isLoading) {
    return (
      <div className="loader">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="featuredInfo">
      <div className="infoBlock">
        <span>Cotizaciones</span>

        <div>
          <span>USD {data?.COTIZACIONES.totalUSD}</span>
        </div>
        <span>Cotizaciones totales</span>
      </div>

      <div className="infoBlock">
        <span>Ventas</span>

        <div>
          <span>USD {data?.VENTAS.totalUSD}</span>
        </div>
        <span>Ventas totales</span>
      </div>

      <div className="infoBlock">
        <span>Cotizaciones Totales</span>
        <div>
          <span>{data?.COTIZACIONES.CANTIDADTOTAL}</span>
        </div>
        <span>Ventas Totales</span>
        <div>
          <span>{data?.VENTAS.CANTIDADTOTAL}</span>
        </div>
      </div>
    </div>
  );
}
