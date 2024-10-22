import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useCotizaciones } from "../../hooks/useCotizaciones";
import BackButton from "../../UI/BackButton";
import Select from "react-select";
import { NumericFormat } from "react-number-format";

export default function CotizacionEdit() {
  const { auth } = useAuth();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const idUsuario = token;

  const {
    cotizacionDetalleQuery: {
      data: cotizacionDetalle,
      isLoading: isLoadingCotizacion,
    },
    cotizacionEditMutation: { mutate: cotizacionEdit },
  } = useCotizaciones(null, id);

  const [formData, setFormData] = useState({
    idUsuario: idUsuario,
    idCotizacion: "",
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

  useEffect(() => {
    if (!isLoadingCotizacion && cotizacionDetalle) {
      // Verificar si existe cotizacionDetalle y si tiene cotizacionesIndividuales
      const cotizaciones = cotizacionDetalle.cotizacionesIndividuales || [];

      // Actualizar formData con la información del detalle de cotización
      setFormData({
        idUsuario: idUsuario,
        id: cotizacionDetalle.idCotizacion || "",
        codigoCotizacion: cotizacionDetalle.codigoCotizacion || "",
        idCliente: cotizacionDetalle.idCliente || "",
        idProducto: cotizacionDetalle.idProducto || "",
        notasEmail: cotizacionDetalle.notasEmail || "",
        cliente: cotizacionDetalle.cliente.email || "",
        familia: cotizacionDetalle.producto.familia || "",
        CUIT: cotizacionDetalle.cliente.CUIT || "",
        razonSocial: cotizacionDetalle.cliente.razonSocial || "",
        marca: cotizacionDetalle.producto.marca || "",
        modelo: cotizacionDetalle.producto.modelo || "",
        notasUsuario: cotizacionDetalle.notasUsuario || "",
        plazoEntrega: cotizacionDetalle.plazoEntrega || "",
        formaPago: cotizacionDetalle.formaPago || "",
        mantenimientoOferta: cotizacionDetalle.mantenimientoOferta || "",
        lugarEntrega: cotizacionDetalle.lugarEntrega || "",
        garantia: cotizacionDetalle.garantia || "",
        entregaTecnica: cotizacionDetalle.entregaTecnica || "",
        origenFabricacion: cotizacionDetalle.origenFabricacion || "",
        patentamiento: cotizacionDetalle.patentamiento || "",

        cotizacionesIndividuales: cotizaciones.map((cotizacionIndividual) => ({
          id: cotizacionIndividual.id,
          precio: cotizacionIndividual.precio || "",
          PrecioFinalEnPesos: cotizacionIndividual.PrecioFinalEnPesos || "",
          precioEnPesos: cotizacionIndividual.precioEnPesos || "",
          anticipo: cotizacionIndividual.anticipo || 0,
          anticipoPorcentaje: cotizacionIndividual.anticipoPorcentaje || 0,
          saldoAFinanciar: cotizacionIndividual.saldoAFinanciar || 0,
          IVA: cotizacionIndividual.IVA || 10.5,
          cotizacionDolar: cotizacionIndividual.cotizacionDolar || "",
          moneda: cotizacionIndividual.moneda || "USD",
          saldoConInteres: cotizacionIndividual.saldoConInteres || 0,
          interes: cotizacionIndividual.interes || 0,
          cuotas: cotizacionIndividual.cuotas || 1,
          cuotaValor: cotizacionIndividual.cuotaValor || null,
          cuotaValorEnPesos: cotizacionIndividual.cuotaValorEnPesos || null,
          PrecioFinal: cotizacionIndividual.PrecioFinal || "",
          cantidadProducto: cotizacionIndividual.cantidadProducto || 0,
          estado: cotizacionIndividual.estado || 1,
        })),
      });
    }
  }, [isLoadingCotizacion, cotizacionDetalle, idUsuario, id]);

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

  const removeCotizacionIndividual = (index) => {
    const updatedCotizaciones = formData.cotizacionesIndividuales.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      cotizacionesIndividuales: updatedCotizaciones,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    let cotizacionDolar = parseFloat(cotizacion.cotizacionDolar) || 1; // Aseguramos que tenga un valor válido

    // Calcular anticipoPorcentaje
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
      anticipoPorcentaje: anticipoPorcentaje.toFixed(2), // Nuevo campo agregado
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
    formData.cotizacionesIndividuales.map((c) => c.precio).join(),
    formData.cotizacionesIndividuales.map((c) => c.anticipo).join(),
    formData.cotizacionesIndividuales.map((c) => c.IVA).join(),
    formData.cotizacionesIndividuales.map((c) => c.cuotas).join(),
    formData.cotizacionesIndividuales.map((c) => c.interes).join(),
    formData.cotizacionesIndividuales.map((c) => c.cotizacionDolar).join(),
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    cotizacionEdit(formData);
  };

  return (
    <div className="postVentaContainer">
      <BackButton />
      <form onSubmit={handleSubmit}>
        <div>
          <h2 className="tituloCompo">Modificar Cotización</h2>{" "}
          <h2> {formData.codigoCotizacion}</h2>
          <br />
        </div>
        <div></div>
        <div className="form-group">
          <label className="form-label">Vendedor</label>
          <input
            type="number"
            name="idUsuario"
            placeholder={`${auth?.nombre || ""} ${auth?.apellido || ""}`}
            onChange={handleChange}
            readOnly
            className="form-input"
            value={formData.idUsuario}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Cliente</label>
          <div className="cliente-info">
            <div className="form-group cliente-detail">
              <Select
                name="idCliente"
                value={{
                  label: formData.cliente || "",
                  value: formData.idCliente || "",
                }}
                isDisabled={true}
                onChange={(option) =>
                  setFormData({ ...formData, cliente: option?.value || "" })
                }
                options={[]}
                className="form-select"
              />
            </div>
          </div>
          <div className="info-cliente-edit">
            <span>
              {" "}
              CUIT: {formData.CUIT} {""}
            </span>
            <span> RAZÓN SOCIAL: {formData.razonSocial}</span>
          </div>
        </div>
        <div></div>
        <div className="postVentaContainer2">
          <div className="form-group">
            <label className="form-label">Familia</label>
            <input
              type="text"
              name="idProducto"
              value={formData.familia}
              onChange={handleChange}
              className="form-input"
              disabled
            />
          </div>
          <div className="form-group">
            <label className="form-label">Marca</label>
            <input
              type="text"
              name="idProducto"
              value={formData.marca}
              onChange={handleChange}
              className="form-input"
              disabled
            />
          </div>
          <div className="form-group">
            <label className="form-label">Modelo</label>
            <input
              type="text"
              name="idProducto"
              value={formData.modelo}
              onChange={handleChange}
              className="form-input"
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Plazo de Entrega</label>
            <input
              type="text"
              name="plazoEntrega"
              value={formData.plazoEntrega}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Forma de Pago</label>
            <input
              type="text"
              name="formaPago"
              value={formData.formaPago}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mantenimiento Oferta</label>
            <input
              type="text"
              name="mantenimientoOferta"
              value={formData.mantenimientoOferta}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Lugar de Entrega</label>
            <input
              type="text"
              name="lugarEntrega"
              value={formData.lugarEntrega}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Garantía</label>
            <input
              type="text"
              name="garantia"
              value={formData.garantia}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Entrega Técnica</label>
            <input
              type="text"
              name="entregaTecnica"
              value={formData.entregaTecnica}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Origen de Fabricación</label>
            <input
              type="text"
              name="origenFabricacion"
              value={formData.origenFabricacion}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Patentamiento</label>
            <input
              type="text"
              name="patentamiento"
              value={formData.patentamiento}
              onChange={handleChange}
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
              <label className="form-label">Cantidad</label>
              <input
                type="number"
                value={cotizacion.cantidadProducto}
                onChange={(e) =>
                  handleCotizacionIndividualChange(
                    index,
                    "cantidadProducto",
                    e.target.value
                  )
                }
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Moneda</label>
              <input
                type="text"
                value={cotizacion.moneda}
                onChange={(e) =>
                  handleCotizacionIndividualChange(
                    index,
                    "moneda",
                    e.target.value
                  )
                }
                className="form-input"
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
              <label className="form-label">IVA</label>
              <input
                type="number"
                value={cotizacion.IVA}
                onChange={(e) =>
                  handleCotizacionIndividualChange(index, "IVA", e.target.value)
                }
                className="form-input"
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
                  <label className="form-label">Saldo a Financiar:</label>
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
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Interés</label>
              <input
                type="number"
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
              <label className="form-label">Precio Final</label>
              <input
                type="text"
                value={cotizacion.PrecioFinal}
                readOnly
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
              <label className="form-label">IVA a 30 días:</label>
              <input
                type="text"
                name={`cotizacionesIndividuales[${index}].IVAConECheq`}
                value={cotizacion.IVAConECheq}
                disabled
                className="form-input"
              />
            </div>
            <div>
              {cotizacion.estado !== 2 && cotizacion.estado !== 3 && (
                <button
                  type="button"
                  className="buttonEliminar"
                  onClick={() => removeCotizacionIndividual(index)}
                >
                  Eliminar Cotización
                </button>
              )}
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
          <label className="form-label">Notas Email</label>
          <textarea
            name="notasEmail"
            value={formData.notasEmail}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Notas Usuario</label>
          <textarea
            name="notasUsuario"
            value={formData.notasUsuario}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>
        <button type="submit" className="form-submit">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
