import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useClientes } from "../../hooks/useClientes";
import { useProducto } from "../../hooks/useProductos";
import Select from "react-select";
import { useCotizaciones } from "../../hooks/useCotizaciones";
import { useUsuario } from "../../hooks/useUsuarios";
import BackButton from "../../UI/BackButton";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";

const Cotizador = () => {
  const { auth } = useAuth();
  const { mutate: cotizacionCreate } = useCotizaciones().cotizacionMutation;
  const token = localStorage.getItem("token");
  const idUsuario = token;
  const [showForm, setShowForm] = useState(false);

  const toggleFormVisibility = () => {
    setShowForm((prev) => !prev);
  };

  // CHEQUEAMOS EL ROL PARA EL INTERES //
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

  useEffect(() => {
    if (idUsuario) {
      handleCheckRol();
    }
  }, [idUsuario]);

  const role = rolData?.data.rol;

  const [selectedCliente, setSelectedCliente] = useState(null);
  const [familias, setFamilias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [selectedFamilia, setSelectedFamilia] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [selectedModelo, setSelectedModelo] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);

  const { data: clientes, isLoading } = useClientes(idUsuario).clienteoQuery;
  const { data: productos } = useProducto().productosParaCotizarQuery;

  useEffect(() => {
    if (!isLoading && productos) {
      const familiasUnicas = Array.from(
        new Set(productos.map((p) => p.familia))
      );
      setFamilias(familiasUnicas.map((f) => ({ value: f, label: f })));
    }
  }, [productos, isLoading]);

  useEffect(() => {
    if (selectedFamilia) {
      const marcasFiltradas = productos.filter(
        (p) => p.familia === selectedFamilia.value
      );
      const marcasUnicas = Array.from(
        new Set(marcasFiltradas.map((p) => p.marca))
      );
      setMarcas(marcasUnicas.map((m) => ({ value: m, label: m })));
      setModelos([]);
      setSelectedMarca(null);
      setSelectedModelo(null);
    }
  }, [selectedFamilia]);

  useEffect(() => {
    if (selectedMarca) {
      const modelosFiltrados = productos.filter(
        (p) => p.marca === selectedMarca.value
      );
      const modelosUnicos = Array.from(
        new Set(modelosFiltrados.map((p) => p.modelo))
      );
      setModelos(modelosUnicos.map((m) => ({ value: m, label: m })));
      setSelectedModelo(null);
    }
  }, [selectedMarca]);

  useEffect(() => {
    if (selectedModelo) {
      const producto = productos.find((p) => p.modelo === selectedModelo.value);
      setSelectedProducto(producto);
      setFormData((prevData) => ({
        ...prevData,
        idProducto: producto?.id,
      }));
    }
  }, [selectedModelo, productos]);

  const [formData, setFormData] = useState({
    idUsuario: idUsuario,
    idCliente: "",
    idProducto: "",
    notasEmail: "",
    notasUsuario: "",
    plazoEntrega: "",
    formaPago: "",
    mantenimientoOferta: "",
    lugarEntrega: "",
    garantia: "",
    entregaTecnica: "",
    origenFabricacion: "",
    patentamiento: "",
    CotizacionPDF: "",
    cotizacionesIndividuales: [
      {
        precio: "",
        precioEnPesos: "",
        cotizacionDolar: 0,
        anticipoPorcentaje: 0,
        anticipo: 0,
        saldoAFinanciar: 0,
        IVA: 10.5,
        moneda: "USD",
        saldoConInteres: 0,
        interes: 0,
        cuotas: 1,
        cuotaValor: null,
        cuotaValorEnPesos: null,
        PrecioFinal: "",
        PrecioFinalEnPesos: "",
        cantidadProducto: 0,
        estado: 1,
      },
    ],
  });

  const handleCotizacionIndividualChange = (index, field, value) => {
    const updatedCotizaciones = [...formData.cotizacionesIndividuales];
    const newValue = field === "cuotas" ? parseInt(value, 10) : value;
    let cotizacion = updatedCotizaciones[index];
    let precio = parseFloat(cotizacion.precio) || 0;

    // Actualizar el campo que ha cambiado
    cotizacion = {
      ...cotizacion,
      [field]: newValue,
    };

    // Si se cambia el campo "cuotas", calcular el nuevo interés
    if (field === "cuotas") {
      const nuevoInteres = newValue > 1 ? newValue * 3.5 : 0;
      cotizacion = {
        ...cotizacion,
        interes: nuevoInteres,
      };
    }

    // Si se modifica el anticipo en dólares, calcular el porcentaje
    if (field === "anticipo") {
      let anticipo = parseFloat(newValue) || 0;
      let anticipoPorcentaje = (anticipo / precio) * 100 || 0;

      cotizacion = {
        ...cotizacion,
        anticipo: newValue,
        anticipoPorcentaje: anticipoPorcentaje.toFixed(2),
      };
    }

    // Si se modifica el porcentaje, calcular el anticipo en dólares
    if (field === "anticipoPorcentaje") {
      let anticipoPorcentaje = parseFloat(newValue) || 0;
      let anticipo = (anticipoPorcentaje / 100) * precio || 0;

      cotizacion = {
        ...cotizacion,
        anticipoPorcentaje: newValue,
        anticipo: anticipo.toFixed(2),
      };
    }

    // Actualizar la cotización modificada
    updatedCotizaciones[index] = cotizacion;

    // Actualizar el estado con los nuevos valores
    setFormData({
      ...formData,
      cotizacionesIndividuales: updatedCotizaciones,
    });
  };

  // Función para añadir una nueva cotización individual
  const addCotizacionIndividual = () => {
    setFormData({
      ...formData,
      cotizacionesIndividuales: [
        ...formData.cotizacionesIndividuales,
        {
          precio: "",
          precioEnPesos: "",
          cotizacionDolar: 0,
          anticipoPorcentaje: 0,
          anticipo: 0,
          saldoAFinanciar: 0,
          IVA: 10.5,
          moneda: "USD",
          saldoConInteres: 0,
          interes: 0,
          cuotas: 1,
          cuotaValor: null,
          cuotaValorEnPesos: null,
          PrecioFinal: "",
          PrecioFinalEnPesos: "",
          cantidadProducto: 0,
          estado: 1,
        },
      ],
    });
  };

  // Función para eliminar una cotización individual por índice
  const removeCotizacionIndividual = (index) => {
    const updatedCotizaciones = formData.cotizacionesIndividuales.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      cotizacionesIndividuales: updatedCotizaciones,
    });
  };

  useEffect(() => {
    if (selectedCliente) {
      setFormData((prevData) => ({
        ...prevData,
        idCliente: selectedCliente.id,
        nombreCliente: selectedCliente.nombre,
        apellidoCliente: selectedCliente.apellido,
        cuitCliente: selectedCliente.CUIT,
      }));
    }
  }, [selectedCliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClienteChange = (selectedOption) => {
    setSelectedCliente(selectedOption);
  };

  useEffect(() => {
    const updatedCotizaciones = formData.cotizacionesIndividuales.map(
      (cotizacion, idx) => {
        if (cotizacion.cuotas > 1) {
          const nuevoInteres = cotizacion.cuotas * 3.5;
          return {
            ...cotizacion,
            interes: nuevoInteres,
          };
        }
        return cotizacion;
      }
    );

    setFormData((prevData) => ({
      ...prevData,
      cotizacionesIndividuales: updatedCotizaciones,
    }));
  }, []);

  const calcularValoresCotizacion = (cotizacion) => {
    let precio = parseFloat(cotizacion.precio) || 0;
    let anticipo = parseFloat(cotizacion.anticipo) || 0;
    let IVA = parseFloat(cotizacion.IVA) || 0;
    let interes = parseFloat(cotizacion.interes) || 0;
    let cotizacionDolar = parseFloat(cotizacion.cotizacionDolar) || 1;

    // Calcular el porcentaje de anticipo
    let anticipoPorcentaje = (anticipo / precio) * 100 || 0;

    let saldoAFinanciar = precio - anticipo;
    let saldoConInteres = saldoAFinanciar * (1 + interes / 100);
    let cuotaValor = null;

    if (cotizacion.cuotas > 0) {
      cuotaValor = saldoConInteres / cotizacion.cuotas;
    }

    let PrecioFinal =
      cotizacion.cuotas === 1
        ? precio * (1 + IVA / 100)
        : (saldoConInteres + anticipo) * (1 + IVA / 100);

    // Calcular valores en Pesos
    let precioEnPesos = precio * cotizacionDolar;
    let cuotaValorEnPesos =
      cuotaValor !== null ? cuotaValor * cotizacionDolar : null;
    let PrecioFinalEnPesos = PrecioFinal * cotizacionDolar;

    return {
      anticipoPorcentaje: anticipoPorcentaje.toFixed(2),
      saldoAFinanciar: saldoAFinanciar.toFixed(2),
      saldoConInteres: saldoConInteres.toFixed(2),
      cuotaValor: cuotaValor !== null ? cuotaValor.toFixed(2) : null,
      PrecioFinal: PrecioFinal.toFixed(2),
      precioEnPesos: precioEnPesos.toFixed(2),
      cuotaValorEnPesos:
        cuotaValorEnPesos !== null ? cuotaValorEnPesos.toFixed(2) : null,
      PrecioFinalEnPesos: PrecioFinalEnPesos.toFixed(2),
    };
  };

  const calcularIVA = (cotizacion) => {
    const valores = calcularValoresCotizacion(cotizacion);
    const { anticipo, IVA, cuotas } = cotizacion;
    const cuotaValorEnPesos = valores.cuotaValorEnPesos || 0; // Obtener de valores calculados

    // Cálculo del IVA según la fórmula proporcionada
    const ivaResultado =
      anticipo > 0
        ? (cuotaValorEnPesos * cuotas + anticipo * cotizacion.cotizacionDolar) *
          (IVA / 100)
        : cuotaValorEnPesos * cuotas * (IVA / 100);

    // Formato del resultado con toLocaleString
    return ivaResultado.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // useEffect para recalcular valores cuando cambian ciertos campos
  useEffect(() => {
    const updatedCotizaciones = formData.cotizacionesIndividuales.map(
      (cotizacion) => {
        const valoresCalculados = calcularValoresCotizacion(cotizacion);
        const ivaCalculado = calcularIVA(cotizacion);
        return {
          ...cotizacion,
          ...valoresCalculados,
          IVAConECheq: ivaCalculado,
        };
      }
    );

    setFormData((prevData) => ({
      ...prevData,
      cotizacionesIndividuales: updatedCotizaciones,
    }));
  }, [
    // Asegúrate de pasar las propiedades directamente, no como cadenas
    ...formData.cotizacionesIndividuales.map((c) => c.precio),
    ...formData.cotizacionesIndividuales.map((c) => c.anticipo),
    ...formData.cotizacionesIndividuales.map((c) => c.IVA),
    ...formData.cotizacionesIndividuales.map((c) => c.cuotas),
    ...formData.cotizacionesIndividuales.map((c) => c.interes),
    ...formData.cotizacionesIndividuales.map((c) => c.cotizacionDolar),
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    cotizacionCreate(formData);
    setFormData({
      idUsuario: idUsuario,
      idCliente: "",
      idProducto: "",
      notasEmail: "",
      notasUsuario: "",
      plazoEntrega: "",
      formaPago: "",
      mantenimientoOferta: "",
      lugarEntrega: "",
      garantia: "",
      entregaTecnica: "",
      origenFabricacion: "",
      patentamiento: "",
      CotizacionPDF: "",
      cotizacionesIndividuales: [
        {
          precio: "",
          precioEnPesos: "",
          cotizacionDolar: 0,
          anticipoPorcentaje: 0,
          anticipo: 0,
          saldoAFinanciar: 0,
          IVA: 10.5,
          moneda: "USD",
          saldoConInteres: 0,
          interes: 0,
          cuotas: 1,
          cuotaValor: null,
          cuotaValorEnPesos: null,
          PrecioFinal: "",
          PrecioFinalEnPesos: "",
          cantidadProducto: 0,
          estado: 1,
        },
      ],
    });

    setSelectedCliente(null);
    setSelectedFamilia(null);
    setSelectedMarca(null);
    setSelectedModelo(null);
    setSelectedProducto(null);
  };

  const clienteOptions = clientes
    ? clientes.map((cliente) => ({
        value: cliente.id,
        label: cliente.mail,
        id: cliente.id,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        CUIT: cliente.CUIT,
      }))
    : [];

  return (
    <div className="postVentaContainer">
      <form onSubmit={handleSubmit}>
        <BackButton />
        <div>
          <h2 className="tituloCompo">Crear Cotización</h2> <br />
        </div>
        <div></div>
        <div className="form-group">
          <label className="form-label">Vendedor</label>
          <input
            type="number"
            name="idUsuario"
            placeholder={`${auth?.nombre} ${auth?.apellido}`}
            onChange={handleChange}
            readOnly
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cliente</label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Select
              name="idCliente"
              value={
                clienteOptions.find(
                  (option) => option.value === formData.idCliente
                ) || null
              }
              onChange={handleClienteChange}
              options={clienteOptions}
              isLoading={isLoading}
              placeholder="Seleccionar"
              isClearable
              required
              className="form-input"
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
                control: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
              }}
            />
          </div>
        </div>
        {selectedCliente && (
          <div className="cliente-info">
            <div className="form-group cliente-detail">
              <label className="form-label small">Nombre:</label>
              <input
                type="text"
                name="nombreCliente"
                value={selectedCliente.nombre}
                disabled
                className="form-input small"
              />
            </div>
            <div className="form-group cliente-detail">
              <label className="form-label small">Apellido:</label>
              <input
                type="text"
                name="apellidoCliente"
                value={selectedCliente.apellido}
                disabled
                className="form-input small"
              />
            </div>
            <div className="form-group cliente-detail">
              <label className="form-label small">CUIT:</label>
              <input
                type="text"
                name="cuitCliente"
                value={selectedCliente.CUIT}
                disabled
                className="form-input small"
              />
            </div>
          </div>
        )}
        <div className="postVentaContainer2">
          <div className="form-group">
            <label className="form-label">
              Familia <span className="obligatorio">*</span>
            </label>
            <Select
              options={familias}
              value={selectedFamilia}
              onChange={setSelectedFamilia}
              placeholder="Seleccionar"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Marca <span className="obligatorio">*</span>
            </label>
            <Select
              options={marcas}
              value={selectedMarca}
              onChange={setSelectedMarca}
              placeholder="Seleccionar"
              isDisabled={!selectedFamilia}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Modelo <span className="obligatorio">*</span>
            </label>
            <Select
              options={modelos}
              value={selectedModelo}
              onChange={setSelectedModelo}
              placeholder="Seleccionar"
              isDisabled={!selectedMarca}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Plazo de Entrega: <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              name="plazoEntrega"
              value={formData.plazoEntrega}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Forma de Pago: <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              name="formaPago"
              value={formData.formaPago}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Mantenimiento de Oferta: <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              name="mantenimientoOferta"
              value={formData.mantenimientoOferta}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Lugar de Entrega: <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              name="lugarEntrega"
              value={formData.lugarEntrega}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Garantía: <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              name="garantia"
              value={formData.garantia}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Entrega Técnica: <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              name="entregaTecnica"
              value={formData.entregaTecnica}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Origen de Fabricación: <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              name="origenFabricacion"
              value={formData.origenFabricacion}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Patentamiento: <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              name="patentamiento"
              value={formData.patentamiento}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>

        {formData.cotizacionesIndividuales.map((cotizacion, index) => (
          <div key={index} className="postVentaContainer2">
            <div style={{ display: "flex", justifyContent: "center" }}>
              {" "}
              <h2 className="tituloCompo">Cotización</h2> <br />
            </div>
            <div></div>
            <div className="form-group">
              <label className="form-label">
                Cotización Dólar: <span className="obligatorio">*</span>
              </label>
              <NumericFormat
                name={`cotizacionesIndividuales[${index}].cotizacionDolar`}
                value={cotizacion.cotizacionDolar}
                onValueChange={({ value }) =>
                  handleCotizacionIndividualChange(
                    index,
                    "cotizacionDolar",
                    value
                  )
                }
                required
                className="form-input"
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                allowNegative={false}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Cantidad: <span className="obligatorio">*</span>
              </label>
              <input
                type="number"
                name="cantidadProducto"
                value={formData.cantidadProducto}
                onChange={(e) =>
                  handleCotizacionIndividualChange(
                    index,
                    "cantidadProducto",
                    e.target.value
                  )
                }
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Moneda:<span className="obligatorio">*</span>
              </label>
              <input
                disabled
                name={`cotizacionesIndividuales[${index}].moneda`}
                value={cotizacion.moneda}
                onChange={(e) =>
                  handleCotizacionIndividualChange(
                    index,
                    "moneda",
                    e.target.value
                  )
                }
                className="form-input"
                placeholder="USD"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Precio de venta: <span className="obligatorio">*</span>
              </label>
              <NumericFormat
                name={`cotizacionesIndividuales[${index}].precio`}
                value={cotizacion.precio}
                onValueChange={(values) => {
                  const { formattedValue, value } = values;
                  handleCotizacionIndividualChange(index, "precio", value);
                }}
                required
                className="form-input"
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                allowNegative={false}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: "GrayText" }}>
                Precio de Venta en Pesos:
              </label>
              <input
                type="number"
                name={`cotizacionesIndividuales[${index}].precioEnPesos`}
                value={cotizacion.precioEnPesos}
                disabled
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                IVA (10.5%): <span className="obligatorio">*</span>
              </label>
              <input
                type="number"
                name={`cotizacionesIndividuales[${index}].IVA`}
                value={cotizacion.IVA}
                onChange={(e) =>
                  handleCotizacionIndividualChange(index, "IVA", e.target.value)
                }
                className="form-input"
                placeholder="10.5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cuotas</label>
              <select
                name={`cotizacionesIndividuales[${index}].cuotas`}
                value={cotizacion.cuotas}
                onChange={(e) =>
                  handleCotizacionIndividualChange(
                    index,
                    "cuotas",
                    e.target.value
                  )
                }
                className="form-input"
              >
                <option value={1}>Contado</option>
                {Array.from({ length: 11 }, (_, i) => i + 2).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {cotizacion.cuotas > 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">Anticipo:</label>
                  <input
                    type="number"
                    name={`cotizacionesIndividuales[${index}].anticipo`}
                    value={cotizacion.anticipo}
                    onChange={(e) =>
                      handleCotizacionIndividualChange(
                        index,
                        "anticipo", // Cambia el valor del anticipo en dólares
                        e.target.value
                      )
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Anticipo %:</label>
                  <input
                    type="number"
                    name={`cotizacionesIndividuales[${index}].anticipoPorcentaje`}
                    value={
                      cotizacion.anticipoPorcentaje > 0
                        ? Math.floor(cotizacion.anticipoPorcentaje)
                        : ""
                    } // No mostrar 0
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      handleCotizacionIndividualChange(
                        index,
                        "anticipoPorcentaje",
                        isNaN(value) ? "" : Math.floor(value)
                      );
                    }}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Valor de Cuota:</label>
                  <input
                    type="number"
                    name={`cotizacionesIndividuales[${index}].cuotaValor`}
                    value={cotizacion.cuotaValor}
                    onChange={(e) =>
                      handleCotizacionIndividualChange(
                        index,
                        "cuotaValor",
                        e.target.value
                      )
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ color: "gray" }}>
                  <label className="form-label">Valor de Cuota en Pesos:</label>
                  <input
                    type="number"
                    name={`cotizacionesIndividuales[${index}].cuotaValorEnPesos`}
                    value={cotizacion.cuotaValorEnPesos}
                    disabled
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: "GrayText" }}>
                    Saldo a Financiar:
                  </label>
                  <input
                    type="number"
                    name={`cotizacionesIndividuales[${index}].saldoAFinanciar`}
                    value={cotizacion.saldoAFinanciar}
                    onChange={(e) =>
                      handleCotizacionIndividualChange(
                        index,
                        "saldoAFinanciar",
                        e.target.value
                      )
                    }
                    required
                    className="form-input"
                    disabled
                  />
                </div>
              </>
            )}

            <div key={index} className="form-group">
              <label className="form-label">Interés:</label>
              <input
                type="number"
                name={`cotizacionesIndividuales[${index}].interes`}
                value={cotizacion.interes}
                onChange={(e) =>
                  handleCotizacionIndividualChange(
                    index,
                    "interes",
                    e.target.value
                  )
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Precio Final: <span className="obligatorio">*</span>
              </label>
              <input
                type="number"
                name={`cotizacionesIndividuales[${index}].PrecioFinal`}
                value={cotizacion.PrecioFinal}
                disabled
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ color: "gray" }}>
              <label className="form-label">Precio Final en Pesos:</label>
              <input
                type="number"
                name={`cotizacionesIndividuales[${index}].PrecioFinalEnPesos`}
                value={cotizacion.PrecioFinalEnPesos}
                disabled
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: "GrayText" }}>
                IVA a 30 días:{" "}
              </label>
              <input
                type="text"
                name={`cotizacionesIndividuales[${index}].IVAConECheq`}
                value={cotizacion.IVAConECheq}
                disabled
                className="form-input"
              />
            </div>
            <div>
              <button
                className="buttonEliminar"
                type="button"
                onClick={() => removeCotizacionIndividual(index)}
              >
                Eliminar Cotización
              </button>
            </div>
          </div>
        ))}

        <div>
          <button
            type="button"
            className="form-submit"
            onClick={addCotizacionIndividual}
          >
            Añadir Cotización
          </button>
        </div>
        <br />
        <div className="form-group">
          <label className="form-label">Notas para el Cliente</label>
          <textarea
            type="text"
            name="notasEmail"
            value={formData.notasEmail}
            onChange={handleChange}
            className="form-input"
            style={{ width: "100%", height: "150px", padding: "8px" }}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Notas De la Cotización</label>
          <textarea
            type="text"
            name="notasUsuario"
            value={formData.notasUsuario}
            onChange={handleChange}
            className="form-input"
            style={{ width: "100%", height: "150px", padding: "8px" }}
          />
        </div>

        <div className="botoncotizador">
          <button type="submit" className="form-submit">
            Guardar Cotización
          </button>
        </div>
      </form>
    </div>
  );
};

export default Cotizador;
