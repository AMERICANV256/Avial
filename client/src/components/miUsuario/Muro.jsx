import React, { useState, useEffect } from "react";
import Spinner from "../../UI/Spinner";
import BackButton from "../../UI/BackButton";
import { useOfertasNovedades } from "../../hooks/useOfertasNovedades";
import Layout from "../../pages/Layout";
import { useRef } from "react";
import Card from "../Card";
import { useProducto } from "../../hooks/useProductos";
import Contact from "../Contact";

export default function Muro() {
  const [producto, setProducto] = useState(null);
  const cardsContainerRef = useRef(null);
  const carouselRef = useRef(null);
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState("");
  const { data } = useOfertasNovedades().ofertaNovedadQuery;
  const [contact, setContact] = useState(false);

  const handleMostrarModalContact = () => {
    setContact(true);
  };

  const handleCerrarModalContact = () => {
    setContact(false);
  };

  const { data: productos, isLoading } = useProducto(
    null,
    selectedMarca
  ).productoQueryByFamilia;

  useEffect(() => {
    if (productos) {
      setProducto(productos);
    }
  }, [productos]);

  useEffect(() => {
    if (busquedaActiva && cardsContainerRef.current) {
      const firstCard = cardsContainerRef.current.querySelector(".card");
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [busquedaActiva, producto]);

  useEffect(() => {
    if (busquedaActiva && carouselRef.current) {
      carouselRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [busquedaActiva]);

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

  const handleFamiliaClick = (familia) => {
    const familiaNormalized =
      familia.charAt(0).toUpperCase() + familia.slice(1).toLowerCase();
    setSelectedMarca(familiaNormalized);
    setBusquedaActiva(true);
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
      <BackButton />
      <div className="NovedadesTitle">
        <br /> <br /> <br /> <h3 style={{ fontFamily: "merri" }}>Novedades</h3>
      </div>
      <div className="ofertas-list">
        {data && data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className="oferta-item">
              <img src={item.foto} alt={`Oferta ${item.id}`} />
              <br />
              <p>
                {" "}
                <strong>{item.novedades}</strong>
              </p>
            </div>
          ))
        ) : (
          <p>No hay ofertas o novedades disponibles.</p>
        )}
      </div>
      {busquedaActiva && (
        <div ref={cardsContainerRef} className="cards-container">
          {producto && producto.length > 0 ? (
            producto.map((maquina) => <Card key={maquina.id} {...maquina} />)
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
      )}
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="submit-button" onClick={handleMostrarModalContact}>
          Contacto
        </button>
      </div>
      {contact && (
        <div className="modal">
          <Contact handleCerrarModalContact={handleCerrarModalContact} />
        </div>
      )}
      <br />
    </Layout>
  );
}
