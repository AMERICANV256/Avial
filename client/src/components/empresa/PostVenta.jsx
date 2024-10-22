import React, { useState, useEffect } from "react";
import garantia from "../../assets/img/POSTVENTA/garantia.png";
import postventa from "../../assets/img/POSTVENTA/POSTVENTA.png";
import Layout from "../../pages/Layout";
import { useRef } from "react";
import Card from "../Card";
import Spinner from "../../UI/Spinner";
import { useProducto } from "../../hooks/useProductos";
import Contact from "../Contact";

export default function PostVenta() {
  const [producto, setProducto] = useState(null);
  const cardsContainerRef = useRef(null);
  const carouselRef = useRef(null);
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState("");
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
      <div className="postVentaContainer">
        <img src={postventa} alt="PostVenta" className="large-images" />

        <h2 className="postVentaSubtitle">
          ¿Por qué hacer su servicio de PostVenta con nosotros?
        </h2>
        <ul className="postVentaList">
          <li>Porque mantiene la vigencia de su garantía.</li>
          <li>Porque extiende la vida útil de su equipo nuevo.</li>
          <li>
            Porque obtiene descuentos en la compra de repuestos en todo el país.
          </li>
          <li>
            Porque su equipo es trabajado por un equipo técnico especializado.
          </li>
          <li>
            Porque contamos con una flota de Servicio técnico distribuida en los
            puntos estratégicos de todo el país.
          </li>
        </ul>
        <img src={garantia} alt="Garantía" style={{ width: "25%" }} />
        <div className="postVentaFooter">
          <h3>LLEVAMOS MAS DE 10000 MAQUINAS VENDIDAS</h3>
          <h3>CON MAS DE 25 MILLONES DE HORAS DE USO,</h3>
          <h3>QUE NOS DAN EL AVAL Y PRESTIGIO</h3>
          <h3>A NUESTRA MARCA AMERICAN VIAL.</h3>
          <p>Buscamos la Excelencia de Servicio</p>
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

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="submit-button" onClick={handleMostrarModalContact}>
            Contacto
          </button>
        </div>
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
