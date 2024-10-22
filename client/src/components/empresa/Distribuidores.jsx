import React, { useState, useEffect, useRef } from "react";
import Distribuidores1 from "../../assets/img/DISTRIBUIDORES/DISTRIBUIDORES.png";
import julio from "../../assets/img/DISTRIBUIDORES/9julio.jpg";
import catamarca from "../../assets/img/DISTRIBUIDORES/catamarca.jpg";
import cordoba from "../../assets/img/DISTRIBUIDORES/cordoba.jpg";
import corrientes from "../../assets/img/DISTRIBUIDORES/corrientes.jpg";
import salta from "../../assets/img/DISTRIBUIDORES/salta.jpg";
import sanluis from "../../assets/img/DISTRIBUIDORES/sanluis.jpg";
import santiago from "../../assets/img/DISTRIBUIDORES/santiago.jpg";
import sanjuan from "../../assets/img/DISTRIBUIDORES/sanjuan.jpg";
import Contact from "../Contact";
import Layout from "../../pages/Layout";
import { useProducto } from "../../hooks/useProductos";
import Spinner from "../../UI/Spinner";
import Card from "../Card";

export default function Distribuidores() {
  const [contact, setContact] = useState(false);
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState("");
  const cardsContainerRef = useRef(null);

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
  }, [busquedaActiva, selectedMarca]);

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
        <div className="large-images">
          <img src={Distribuidores1} alt="Repuestos" className="large-images" />
        </div>

        <div className="grid-imagesdist">
          <img src={julio} alt="Foto 1" className="grid-imagedist" />
          <img src={catamarca} alt="Foto 2" className="grid-imagedist" />
          <img src={cordoba} alt="Foto 3" className="grid-imagedist" />
          <img src={corrientes} alt="Foto 4" className="grid-imagedist" />
          <img src={salta} alt="Foto 5" className="grid-imagedist" />
          <img src={sanluis} alt="Foto 6" className="grid-imagedist" />
          <img src={santiago} alt="Foto 7" className="grid-imagedist" />
          <img src={sanjuan} alt="Foto 8" className="grid-imagedist" />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <button className="submit-button" onClick={handleMostrarModalContact}>
            Contacto
          </button>
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

      {contact && (
        <div className="modal">
          <Contact handleCerrarModalContact={handleCerrarModalContact} />
        </div>
      )}
      <br />
    </Layout>
  );
}
