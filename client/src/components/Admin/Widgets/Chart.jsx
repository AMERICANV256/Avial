import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUsuario } from "../../../hooks/useUsuarios";

export default function Chart({ title, dataKey, grid }) {
  const { data, isLoading } = useUsuario().usuariosChartQuery;

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Verificar si hay datos
  if (!data || data.length === 0) {
    return <div>No hay datos de usuarios para mostrar.</div>;
  }

  // Agrupar usuarios por mes
  const usuariosAgrupados = data.reduce((acumulador, usuario) => {
    const fecha = new Date(usuario.createdAt);
    const mes = fecha.toLocaleString("default", { month: "short" });
    const mesAbreviado = mes.slice(0, 3); // Obtener las primeras tres letras del nombre del mes
    const anio = fecha.getFullYear();
    const clave = `${mesAbreviado}-${anio}`;

    if (!acumulador[clave]) {
      acumulador[clave] = [];
    }
    acumulador[clave].push(usuario);
    return acumulador;
  }, {});

  // Construir objeto con usuarios por mes
  const usuariosPorMes = {
    ene: usuariosAgrupados["ene-2024"] || [],
    feb: usuariosAgrupados["feb-2024"] || [],
    mar: usuariosAgrupados["mar-2024"] || [],
    abr: usuariosAgrupados["abr-2024"] || [],
    may: usuariosAgrupados["may-2024"] || [],
    jun: usuariosAgrupados["jun-2024"] || [],
    jul: usuariosAgrupados["jul-2024"] || [],
    ago: usuariosAgrupados["ago-2024"] || [],
    sep: usuariosAgrupados["sep-2024"] || [],
    oct: usuariosAgrupados["oct-2024"] || [],
    nov: usuariosAgrupados["nov-2024"] || [],
    dic: usuariosAgrupados["dic-2024"] || [],
  };

  // Formatear datos para el gráfico
  const dataForChart = Object.entries(usuariosPorMes).map(
    ([mes, usuarios]) => ({
      name: mes.charAt(0).toUpperCase() + mes.slice(1),
      [dataKey]: usuarios.length,
    })
  );

  return (
    <div>
      <span>{title}</span>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={dataForChart}>
          <XAxis dataKey="name" stroke="#5550bd" />
          <Line type="monotone" dataKey={dataKey} />
          <Tooltip />
          {grid && <CartesianGrid />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
