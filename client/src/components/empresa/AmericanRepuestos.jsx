import React, { useState, useRef, useEffect } from "react";
import Layout from "../../pages/Layout";
import repuestosimage from "../../assets/img/REPUESTOS/REPUESTOS.png";
import foto1 from "../../assets/img/REPUESTOS/foto1.jpg";
import foto2 from "../../assets/img/REPUESTOS/foto2.jpg";
import foto3 from "../../assets/img/REPUESTOS/foto3.jpg";
import foto4 from "../../assets/img/REPUESTOS/foto4.jpg";
import foto5 from "../../assets/img/REPUESTOS/foto5.jpg";
import foto6 from "../../assets/img/REPUESTOS/foto6.jpg";
import foto7 from "../../assets/img/REPUESTOS/foto7.jpg";
import foto8 from "../../assets/img/REPUESTOS/foto8.jpg";
import foto9 from "../../assets/img/REPUESTOS/foto9.jpg";
import Contact from "../Contact";
import Card from "../Card";
import { useProducto } from "../../hooks/useProductos";
import Spinner from "../../UI/Spinner";

export default function AmericanRepuestos() {
  const [contact, setContact] = useState(false);
  const [selectedFamilia, setSelectedFamilia] = useState(null);
  const cardsContainerRef = useRef(null);
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const { data: productos, isLoading } = useProducto(
    null,
    selectedFamilia
  ).productoQueryByFamilia;

  useEffect(() => {
    if (selectedFamilia && productos?.length > 0) {
      scrollToFirstCard();
    }
  }, [selectedFamilia, productos]);

  const handleFamiliaClick = (familia) => {
    const familiaNormalized =
      familia.charAt(0).toUpperCase() + familia.slice(1).toLowerCase();
    setSelectedFamilia(familiaNormalized);
  };

  const handleSearchByMarca = (familia) => {
    const palabras = familia.split(" ");

    const palabrasNormalizadas = palabras.map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    );

    const marcaNormalized = palabrasNormalizadas.join(" ");

    setSelectedFamilia(marcaNormalized);
    setBusquedaActiva(true);
  };

  const handleMostrarModalContact = () => {
    setContact(true);
  };

  const handleCerrarModalContact = () => {
    setContact(false);
  };

  const scrollToFirstCard = () => {
    if (cardsContainerRef.current) {
      const firstCard = cardsContainerRef.current.querySelector(".card");
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
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
      onSelectFamilia={handleFamiliaClick}
      onSearchByMarca={handleSearchByMarca}
    >
      <div className="postVentaContainer">
        <div className="large-images">
          <img src={repuestosimage} alt="Repuestos" className="large-images" />
        </div>

        <h3>
          Equipamiento Integral e Infraestructura para dar respuestas
          satisfactorias
        </h3>
        <br />
        <div className="grid-images">
          <img src={foto1} alt="Foto 1" className="grid-image" />
          <img src={foto2} alt="Foto 2" className="grid-image" />
          <img src={foto3} alt="Foto 3" className="grid-image" />
          <img src={foto4} alt="Foto 4" className="grid-image" />
          <img src={foto5} alt="Foto 5" className="grid-image" />
          <img src={foto6} alt="Foto 6" className="grid-image" />
          <img src={foto7} alt="Foto 7" className="grid-image" />
          <img src={foto8} alt="Foto 8" className="grid-image" />
          <img src={foto9} alt="Foto 9" className="grid-image" />
        </div>
        <br />
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="submit-button" onClick={handleMostrarModalContact}>
            Contacto
          </button>
        </div>
      </div>
      {selectedFamilia && (
        <div ref={cardsContainerRef} className="cards-container">
          {productos?.length > 0 ? (
            productos.map((producto) => (
              <Card key={producto.id} {...producto} />
            ))
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </div>
      )}

      {contact && (
        <div className="modal">
          <Contact handleCerrarModalContact={handleCerrarModalContact} />
        </div>
      )}
      <br />
    </Layout>
  );
}
