import React, { useEffect, useState } from "react";
import { useRanking } from "../../hooks/useCotizaciones";
import { FaTimes } from "react-icons/fa";
import Spinner from "../../UI/Spinner";

export default function HistorialRanking() {
  const { data, isLoading } = useRanking().rankingQuery;
  const [showRanking, setShowRanking] = useState(true);

  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (!data || !showRanking) return null;

  console.log(data);

  return (
    <div className="contact-container">
      <button
        className="close-button-ranking"
        onClick={() => setShowRanking(false)}
      >
        <FaTimes />
      </button>
      <h2>Ranking</h2>
      <br />
      <div className="ranking-item">
        <h2>Vendedor con más cotizaciones</h2>
        <p>
          {data?.topUserCotizaciones?.nombre}{" "}
          {data?.topUserCotizaciones?.apellido} con{" "}
          {data?.topUserCotizaciones?.count} cotizaciones.
        </p>
      </div>
      <div className="ranking-item">
        <h2>Vendedor con más ventas</h2>
        <p>
          {data?.topUserVentas?.nombre} {data?.topUserVentas?.apellido} con{" "}
          {data?.topUserVentas?.count} ventas.
        </p>
      </div>
      <div className="ranking-item">
        <h2>Cliente con más cotizaciones</h2>
        <p>
          {data?.topClientCotizaciones?.nombre}{" "}
          {data?.topClientCotizaciones?.apellido} con{" "}
          {data?.topClientCotizaciones?.count} cotizaciones.
        </p>
      </div>
      <div className="ranking-item">
        <h2>Cliente con más ventas</h2>
        <p>
          {data?.topClientVentas?.nombre} {data?.topClientVentas?.apellido} con{" "}
          {data?.topClientVentas?.count} ventas.
        </p>
      </div>
      <div className="ranking-item">
        <h2>Producto con más cotizaciones</h2>
        <p>
          {data?.topProductCotizaciones?.familia}{" "}
          {data?.topProductCotizaciones?.marca}{" "}
          {data?.topProductCotizaciones?.nombre} con{" "}
          {data.topProductCotizaciones?.count} cotizaciones.
        </p>
      </div>
      <div className="ranking-item">
        <h2>Producto con más ventas</h2>
        <p>
          {data?.topProductVentas?.familia} {data?.topProductVentas?.marca}{" "}
          {data?.topProductVentas?.nombre} con {data?.topProductVentas?.count}{" "}
          ventas.
        </p>
      </div>
    </div>
  );
}
