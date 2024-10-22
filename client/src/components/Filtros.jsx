import React, { useState, useEffect } from "react";

export default function Filtros({ filtroPrecio, setFiltroPrecio }) {
  return (
    <div className="filtros">
      <div>
        <span>Filtros</span>
      </div>
      <select
        value={filtroPrecio}
        onChange={(e) => setFiltroPrecio(e.target.value)}
      >
        {" "}
        <option value="" disabled hidden>
          Seleccione...
        </option>
        <option value="menorPrecio">Menor Precio</option>
        <option value="mayorPrecio">Mayor Precio</option>
      </select>
    </div>
  );
}
