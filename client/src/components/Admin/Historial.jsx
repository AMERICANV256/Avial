import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useUsuario } from "../../hooks/useUsuarios";
import { useHistorial } from "../../hooks/useHistorial";
import { useProducto } from "../../hooks/useProductos";
import { useCotizaciones } from "../../hooks/useCotizaciones";
import HistorialRanking from "./HistorialRanking";
import HistorialFechaExcel from "./Excel/HistorialFechaExcel";
import HistorialProductoExcel from "./Excel/HistorialProductoExcel";
import HistorialVendedorExcel from "./Excel/HistorialVendedorExcel";
import BackButton from "../../UI/BackButton";
import { useNavigate } from "react-router-dom";
import Spinner from "../../UI/Spinner";

export default function Historial() {
  const token = localStorage.getItem("token");
  const idUsuario = token;

  const { mutate: checkRol, data: rolData } = useUsuario().CheckRolMutation;

  const navigate = useNavigate();

  const handleCheckRol = async () => {
    try {
      await checkRol({ idUsuario });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        navigate("/");
      }
    }
  };

  const role = rolData?.data.rol;

  useEffect(() => {
    if (idUsuario) {
      handleCheckRol();
    }
  }, [idUsuario]);

  const { data: vendedoresData, isLoading: isLoadingVendedores } =
    useUsuario(idUsuario).vendedoresQuery;

  const { data: productos } = useProducto().productosParaCotizarQuery;
  const [selectedProducto, setSelectedProducto] = useState(null);

  const [selectedVendedor, setSelectedVendedor] = useState(null);
  const [numeroCotizacion, setNumeroCotizacion] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const {
    mutate: CotisPorFecha,
    data: fechasData,
    reset: resetFechas,
    isLoading: isLoadingFechas,
  } = useCotizaciones().cotisPorFechaMutation;

  const {
    mutate: VendedorHistorial,
    data: historialData,
    reset: resetHistorial,
    isLoading: isLoadingHistorial,
  } = useHistorial().historialVendedorMutation;

  const {
    mutate: VendedorModelo,
    data: ModeloData,
    reset: resetModelo,
    isLoading: isLoadingModelo,
  } = useHistorial().historialModeloMutation;

  const handleSubmitFechas = (e) => {
    e.preventDefault();

    if (!fechaDesde || !fechaHasta) {
      alert("Por favor, ingrese ambas fechas.");
      return;
    }

    CotisPorFecha({ fechaDesde, fechaHasta });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedVendedor || !numeroCotizacion) {
      alert(
        "Por favor, seleccione un vendedor e ingrese un número de cotización."
      );
      return;
    }

    const combinedValue = `${selectedVendedor.value}-${numeroCotizacion}`;
    VendedorHistorial({ combinedValue: combinedValue });
  };

  const handleProductoSubmit = (e) => {
    e.preventDefault();

    if (!selectedProducto) {
      alert("Por favor, seleccione un producto.");
      return;
    }

    const modelo = selectedProducto.value;

    VendedorModelo({ modelo: modelo });
  };

  const handleVendedorChange = (selectedOption) => {
    setSelectedVendedor(selectedOption);
  };

  const handleNumeroCotizacionChange = (e) => {
    setNumeroCotizacion(e.target.value);
  };

  const options = vendedoresData?.map((vendedor) => ({
    value: vendedor.id,
    label: `${vendedor.nombre} ${vendedor.apellido}`,
  }));

  const handleClear = () => {
    setSelectedVendedor(null);
    setNumeroCotizacion("");
    setSelectedProducto(null);
    resetHistorial();
    resetModelo();
    setFechaDesde("");
    setFechaHasta("");
    resetFechas();
  };

  const handleProductoChange = (selectedOption) => {
    setSelectedProducto(selectedOption);
  };

  const productoOptions = productos?.map((producto) => ({
    value: producto.modelo,
    label: `${producto.familia} ${producto.marca} ${producto.modelo}`,
  }));

  return (
    <div className="postVentaContainer1">
      <BackButton />
      {role === "administrador" && <HistorialRanking />}
      <h2 className="tituloCompo1">Historial</h2>
      <br />
      <hr />
      <h4> Filtrar por Vendedor</h4>
      <hr />
      <br />
      {isLoadingVendedores ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <Select
              id="vendedor"
              options={options}
              value={selectedVendedor}
              onChange={handleVendedorChange}
            />
          </div>
          <br />
          <div>
            <label htmlFor="numeroCotizacion">Número de Cotización: </label>
            <input
              type="number"
              id="numeroCotizacion"
              value={numeroCotizacion}
              onChange={handleNumeroCotizacionChange}
            />
          </div>
          <button className="form-submit" type="submit">
            Buscar por Vendedor
          </button>
          <button
            className="form-submit"
            type="button"
            onClick={handleClear}
            style={{ marginLeft: "10px" }}
          >
            Limpiar búsqueda
          </button>
        </form>
      )}
      <br />
      <div>
        <HistorialVendedorExcel data={historialData} />
      </div>
      <br />
      <div>
        {isLoadingHistorial ? (
          <p>Cargando historial...</p>
        ) : historialData &&
          historialData.data &&
          historialData.data.length > 0 ? (
          historialData.data.map((detalle) => (
            <div key={detalle.id}>
              <p style={{ fontSize: "larger" }}>
                <strong
                  style={{
                    fontSize: "larger",
                    textDecoration: "underline",
                    textDecorationColor: "#e6b800",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {detalle.estado === 1
                    ? "Detalle de la Cotización:"
                    : detalle.estado === 2
                    ? "COTIZACIÓN CONCRETADA"
                    : detalle.estado === 3
                    ? "Pendiente de Aprobación"
                    : "Estado Desconocido"}
                </strong>
              </p>

              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "15px",
                  padding: "15px",
                  borderBottom: "1px solid #ddd",
                  color: detalle.estado === 2 ? "green" : "black",
                  backgroundColor: detalle.estado === 2 ? "#e6ffe6" : "#fff",
                  boxShadow:
                    detalle.estado === 2
                      ? "0 0 10px green, 0 0 20px green"
                      : "none",
                }}
              >
                <span
                  style={{
                    display: "block",
                    marginBottom: "15px",
                    fontSize: "22px",
                    textDecoration: "underline",
                  }}
                >
                  <strong>Número de Cotización:</strong>{" "}
                  {detalle.codigoCotizacion}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Producto:</strong> {detalle.familia} {detalle.marca}{" "}
                  {detalle.modelo}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Cliente:</strong> {detalle.nombreCliente}{" "}
                  {detalle.apellidoCliente}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Precio de Venta:</strong> {detalle.moneda}{" "}
                  {detalle.precio}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Anticipo:</strong> {detalle.moneda} {detalle.anticipo}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Saldo a Financiar:</strong> {detalle.moneda}{" "}
                  {detalle.saldoAFinanciar}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Financiación:</strong> {detalle.cuotas} Cuotas de{" "}
                  {detalle.moneda} {detalle.cuotaValor}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>IVA:</strong> {detalle.IVA}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Precio Final:</strong> {detalle.moneda}{" "}
                  {detalle.PrecioFinal}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Fecha de Creación:</strong>{" "}
                  {new Date(detalle.fechaDeCreacion).toLocaleDateString(
                    "es-ES",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )}
                </span>

                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Notas de la Cotización:</strong>{" "}
                  {detalle.notasUsuario}
                </span>
              </div>
              <br />
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
      <hr />
      <h4> Filtrar por Producto</h4>
      <hr />
      <br />
      <form onSubmit={handleProductoSubmit}>
        <div>
          <Select
            id="producto"
            options={productoOptions}
            value={selectedProducto}
            onChange={handleProductoChange}
          />
        </div>
        <button className="form-submit" type="submit">
          Buscar por Producto
        </button>
        <button
          className="form-submit"
          type="button"
          onClick={handleClear}
          style={{ marginLeft: "10px" }}
        >
          Limpiar búsqueda
        </button>
      </form>
      <div>
        <br />
        <div>
          <HistorialProductoExcel data={ModeloData} />
        </div>
        {isLoadingModelo ? (
          <p>Cargando historial...</p>
        ) : ModeloData && ModeloData.data && ModeloData.data.length > 0 ? (
          ModeloData.data.map((detalle) => (
            <div key={detalle.id}>
              <p style={{ fontSize: "larger" }}></p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <span
                    style={{
                      display: "block",
                      marginBottom: "15px",
                      fontSize: "22px",
                      textDecoration: "underline",
                    }}
                  >
                    <strong>Número de Cotización:</strong>{" "}
                    {detalle.codigoCotizacion}
                  </span>
                  <span style={{ display: "block", marginBottom: "8px" }}>
                    <strong>Cliente:</strong> {detalle.Cliente?.nombre}{" "}
                    {detalle.Cliente?.apellido}
                  </span>
                  <span style={{ display: "block", marginBottom: "8px" }}>
                    <strong>Vendedor:</strong> {detalle.Usuario?.nombre}{" "}
                    {detalle.Usuario?.apellido}
                  </span>
                  <span style={{ display: "block", marginBottom: "8px" }}>
                    <strong>Fecha de Creación:</strong>{" "}
                    {new Date(detalle.fechaDeCreacion).toLocaleDateString()}
                  </span>
                  <span style={{ display: "block", marginBottom: "8px" }}>
                    <strong>Fecha de Modificación:</strong>{" "}
                    {new Date(detalle.fechaModi).toLocaleDateString()}
                  </span>
                  <strong>Notas de la Cotización:</strong>{" "}
                  {detalle?.notasUsuario}
                </span>
                {detalle.CotizacionIndividuals?.map((individual, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "15px",
                      padding: "15px",
                      borderBottom: "1px solid #ddd",
                      color: individual.estado === 2 ? "green" : "black",
                      backgroundColor:
                        individual.estado === 2 ? "#e6ffe6" : "#fff",
                      boxShadow:
                        individual.estado === 2
                          ? "0 0 10px green, 0 0 20px green"
                          : "none",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "larger",
                        textDecoration: "underline",
                        textDecorationColor: "#e6b800",
                        marginBottom: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      Cotización {index + 1}{" "}
                      {`${
                        individual.estado === 2 ? " (VENTA CONCRETADA)" : ""
                      }`}
                    </p>

                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>Producto:</strong> {detalle.Producto?.marca}{" "}
                      {detalle.Producto?.modelo}
                    </span>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>Precio de Venta:</strong> {individual.moneda}{" "}
                      {individual.precio}
                    </span>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>Anticipo:</strong> {individual.moneda}{" "}
                      {individual.anticipo}
                    </span>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>Saldo a Financiar:</strong> {individual.moneda}{" "}
                      {individual.saldoAFinanciar}
                    </span>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>Financiación:</strong> {individual.cuotas} Pagos
                      de {individual.moneda} {individual.cuotaValor}
                    </span>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>IVA:</strong> {individual.IVA}
                    </span>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>Precio Final:</strong> {individual.moneda}{" "}
                      {individual.PrecioFinal}
                    </span>
                  </div>
                ))}
              </div>

              <br />
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
      <hr />
      <h4> Filtrar por Fecha</h4>
      <hr />
      <br />
      <form onSubmit={handleSubmitFechas}>
        <div>
          <label htmlFor="fechaDesde">Fecha Desde:</label>
          <input
            type="date"
            id="fechaDesde"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label htmlFor="fechaHasta">Fecha Hasta:</label>
          <input
            type="date"
            id="fechaHasta"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>
        <br />
        <button className="form-submit" type="submit">
          Buscar por Fechas
        </button>
        <button
          className="form-submit"
          type="button"
          onClick={handleClear}
          style={{ marginLeft: "10px" }}
        >
          Limpiar búsqueda
        </button>
      </form>
      <br />
      <div>
        <HistorialFechaExcel
          data={fechasData}
          fechaDesde={fechaDesde}
          fechaHasta={fechaHasta}
        />
      </div>
      <br />
      <div>
        {isLoadingFechas ? (
          <p>Cargando cotizaciones...</p>
        ) : fechasData && fechasData.data.length > 0 ? (
          fechasData.data.map((cotizacion) => (
            <div key={cotizacion.id}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <p
                  style={{
                    fontSize: "22px",
                    textDecoration: "underline",
                    marginBottom: "15px",
                    fontWeight: "bold",
                    textDecorationColor: "#e6b800",
                  }}
                ></p>

                <span style={{ display: "block", marginBottom: "8px" }}>
                  <span
                    style={{
                      display: "block",
                      marginBottom: "15px",
                      fontSize: "22px",
                      textDecoration: "underline",
                    }}
                  >
                    <strong>Número de Cotización:</strong>{" "}
                    {cotizacion.codigoCotizacion}
                  </span>
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Cliente:</strong> {cotizacion.Cliente?.nombre}{" "}
                  {cotizacion.Cliente?.apellido}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Vendedor:</strong> {cotizacion.Usuario?.nombre}{" "}
                  {cotizacion.Usuario?.apellido}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Fecha de Creación:</strong>{" "}
                  {new Date(cotizacion.fechaDeCreacion).toLocaleDateString()}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Fecha de Modificación:</strong>{" "}
                  {new Date(cotizacion.fechaModi).toLocaleDateString()}
                </span>
                <span style={{ display: "block", marginBottom: "8px" }}>
                  <strong>Notas de la Cotización:</strong>{" "}
                  {cotizacion?.notasUsuario}
                </span>

                {cotizacion.CotizacionIndividuals?.map((individual, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "15px",
                      padding: "15px",
                      borderBottom: "1px solid #ddd",
                      backgroundColor:
                        individual.estado === 2 ? "#e6ffe6" : "#fff",
                      boxShadow:
                        individual.estado === 2
                          ? "0 0 10px green, 0 0 20px green"
                          : "none",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "larger",
                        textDecoration: "underline",
                        textDecorationColor: "#e6b800",
                        marginBottom: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      Cotización {index + 1}{" "}
                      {`${
                        individual.estado === 2 ? " (VENTA CONCRETADA)" : ""
                      }`}
                    </p>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>Producto:</strong> {cotizacion.Producto?.marca}{" "}
                      {cotizacion.Producto?.modelo}
                    </span>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>Precio de Venta:</strong> {individual.moneda}{" "}
                      {individual.precio}
                    </span>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>Anticipo:</strong> {individual.moneda}{" "}
                      {individual.anticipo}
                    </span>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>Saldo a Financiar:</strong> {individual.moneda}{" "}
                      {individual.saldoAFinanciar}
                    </span>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>Financiación:</strong> {individual.cuotas} Pagos
                      de {individual.moneda} {individual.cuotaValor}
                    </span>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>IVA:</strong> {individual.IVA}
                    </span>
                    <span style={{ display: "block", marginBottom: "8px" }}>
                      <strong>Precio Final:</strong> {individual.moneda}{" "}
                      {individual.PrecioFinal}
                    </span>
                  </div>
                ))}
              </div>
              <br />
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}
