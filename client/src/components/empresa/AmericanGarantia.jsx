import React, { useState, useEffect, useRef } from "react";
import { useGarantia } from "../../hooks/useGarantia";
import Layout from "../../pages/Layout";
import Card from "../Card";
import { useProducto } from "../../hooks/useProductos";
import Spinner from "../../UI/Spinner";

export default function AmericanGarantia() {
  const { mutate: crearGarantia } = useGarantia().GarantiaMutation;
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState("");
  const cardsContainerRef = useRef(null);

  const { data: productos, isLoading } = useProducto(
    null,
    selectedMarca
  ).productoQueryByFamilia;

  const handleFamiliaClick = (familia) => {
    const familiaNormalized =
      familia.charAt(0).toUpperCase() + familia.slice(1).toLowerCase();
    setSelectedMarca(familiaNormalized);
    setBusquedaActiva(true);
  };

  const handleSearchByMarca = (familia) => {
    const palabras = familia.split(" ");

    const palabrasNormalizadas = palabras.map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    );

    const marcaNormalized = palabrasNormalizadas.join(" ");

    setSelectedMarca(marcaNormalized);
    setBusquedaActiva(true);
  };

  useEffect(() => {
    if (busquedaActiva && cardsContainerRef.current) {
      const firstCard = cardsContainerRef.current.querySelector(".card");
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [busquedaActiva, productos]);

  const [formValues, setFormValues] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
    tipoDeMaquina: "",
    marca: "",
    modelo: "",
    numeroDeChasis: "",
    fechaEntregaDelEquipo: "",
    ubicacion: "",
    cantidadHorasHorometro: "",
    falla: "",
  });

  const labels = {
    nombre: "Nombre",
    apellido: "Apellido",
    empresa: "Empresa",
    email: "Email",
    telefono: "Teléfono",
    tipoDeMaquina: "Máquina",
    marca: "Marca",
    modelo: "Modelo",
    numeroDeChasis: "Nro de Chasis",
    fechaEntregaDelEquipo: "Fecha Entrega",
    ubicacion: "Ubicación",
    cantidadHorasHorometro: "Hs Horómetro",
    falla: "Falla",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    crearGarantia(formValues);
  };

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <Layout
      onSearchByMarca={handleSearchByMarca}
      onSelectFamilia={handleFamiliaClick}
    >
      <div className="postVentaContainer">
        <div className="american-garantia-container">
          <div className="form-header">
            <h2
              style={{
                textDecoration: "underline",
                textDecorationColor: "#ffc107",
                textUnderlineOffset: "4px",
              }}
            >
              <strong>RECLAMO DE GARANTÍA</strong>
            </h2>
            <div>
              <p className="text-muted">
                Para realizar una solicitud de reparación por favor complete el
                siguiente formulario con todos los datos requeridos.
              </p>
              <p className="bold-text">
                Un asesor de postVenta se contactará con usted de inmediato.
              </p>
            </div>
          </div>

          <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form-garantia">
              {Object.keys(formValues).map((key) => (
                <div key={key} className="form-group-garantia">
                  <label htmlFor={key}>
                    {labels[key]} <span className="obligatorio">*</span>
                  </label>
                  <input
                    type={
                      key === "fechaEntregaDelEquipo"
                        ? "date"
                        : key === "email"
                        ? "email"
                        : key === "cantidadHorasHorometro"
                        ? "number"
                        : key === "falla"
                        ? "textarea"
                        : "text"
                    }
                    id={key}
                    name={key}
                    value={formValues[key]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
        {busquedaActiva && (
          <div ref={cardsContainerRef} className="cards-container">
            {productos.length > 0 ? (
              productos.map((maquina) => <Card key={maquina.id} {...maquina} />)
            ) : (
              <p>No se encontraron productos.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
