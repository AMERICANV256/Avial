import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import AMERICAN from "../assets/img/AMERICANSINFONDO.png";
import Layout from "../pages/Layout";
import { useProducto } from "../hooks/useProductos";
import ContactoProducto from "./ContactoProducto";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from "./Card";
import Spinner from "../UI/Spinner";
import { FaCircle, FaWhatsapp } from "react-icons/fa";

export default function Detalle() {
  const [producto, setProducto] = useState(null);
  const { id } = useParams();
  const cardsContainerRef = useRef(null);
  const carouselRef = useRef(null);
  const [selectedMarca, setSelectedMarca] = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [contactoProducto, setContactoProducto] = useState(false);

  const { data, isLoading } = useProducto(id).productoQueryById;
  const { data: productos, isLoading: loading } = useProducto(
    null,
    selectedMarca !== "" ? selectedMarca : null
  ).productoQueryByFamilia;

  useEffect(() => {
    if (data) {
      setProducto(data);
    }
  }, [data]);

  const handleSearchByMarca = (familia) => {
    const marcaNormalized =
      familia.charAt(0).toUpperCase() + familia.slice(1).toLowerCase();
    setSelectedMarca(marcaNormalized);
    setBusquedaActiva(true);

    setTimeout(() => {
      if (cardsContainerRef.current) {
        cardsContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleFamiliaClick = (familia) => {
    const familiaNormalized =
      familia.charAt(0).toUpperCase() + familia.slice(1).toLowerCase();
    setSelectedMarca(familiaNormalized);
    setBusquedaActiva(true);

    setTimeout(() => {
      if (cardsContainerRef.current) {
        cardsContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const scrollToCarousel = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleResize = () => setKey((prevKey) => prevKey + 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (!producto) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  const {
    familia,
    marca,
    modelo,
    imagen,
    imagen1,
    imagen2,
    imagen3,
    imagen4,
    imagen5,
    imagen6,
    codigo,
    potencia,
    motor,
    capacidadDeCarga,
    capacidadDeBalde,
    Detalles,
    fichaPDF,
  } = producto;

  const images = [
    imagen,
    imagen1,
    imagen2,
    imagen3,
    imagen4,
    imagen5,
    imagen6,
  ].filter((img) => img);

  const handleMostrarContactoProducto = () => {
    setContactoProducto(true);
  };

  const handleCerrarContactoProducto = () => {
    setContactoProducto(false);
  };

  const detallesArray = Detalles.split("\n");

  const handleFichaTecnicaClick = () => {
    window.open(fichaPDF, "_blank");
  };

  return (
    <Layout
      onSearchByMarca={handleSearchByMarca}
      onSelectFamilia={handleFamiliaClick}
    >
      <div className="postVentaContainer">
        <div className="detallebackground">
          <div
            ref={carouselRef}
            id="carouselContainer"
            className="DetalleCardContainer"
          >
            <div className="DetalleCard">
              <Carousel
                additionalTransfrom={0}
                arrows={false}
                autoPlaySpeed={3000}
                centerMode={false}
                className="custom-carousel"
                containerClass="custom-container"
                dotListClass="custom-dot-list"
                draggable
                focusOnSelect={false}
                infinite
                itemClass="custom-item"
                keyBoardControl
                minimumTouchDrag={80}
                pauseOnHover
                renderArrowsWhenDisabled={false}
                renderButtonGroupOutside={false}
                renderDotsOutside={false}
                responsive={{
                  desktop: {
                    breakpoint: {
                      max: 3000,
                      min: 1024,
                    },
                    items: 1,
                  },
                  mobile: {
                    breakpoint: {
                      max: 464,
                      min: 0,
                    },
                    items: 1,
                  },
                  tablet: {
                    breakpoint: {
                      max: 1024,
                      min: 464,
                    },
                    items: 1,
                  },
                }}
                rewind={false}
                rewindWithAnimation={false}
                rtl={false}
                shouldResetAutoplay
                showDots
                sliderClass="custom-slider"
                slidesToSlide={1}
                swipeable
                autoPlay={true}
              >
                {images.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    className="CarrouselImg"
                    alt={`Imagen ${index + 1}`}
                  />
                ))}
              </Carousel>
            </div>

            <div className="detalle-info">
              <h2>
                <strong>{familia}</strong>
              </h2>
              <h1>
                <strong>
                  {marca} {modelo}
                </strong>
              </h1>
              <br />

              <p>
                <strong>Potencia:</strong> {potencia}
              </p>

              <p>
                <strong>Motor:</strong> {motor}
              </p>
              <p>
                <strong>Capacidad de Carga:</strong> {capacidadDeCarga}
              </p>
              <p>
                <strong>Capacidad de Balde:</strong> {capacidadDeBalde}
              </p>
              <p>
                <strong>Código:</strong> {codigo}
              </p>
              {fichaPDF && (
                <div className="fichatenica">
                  <button
                    className="submit-button"
                    onClick={handleFichaTecnicaClick}
                  >
                    FICHA TÉCNICA
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="detalles-container">
            <strong className="detalles-titulo">DETALLES</strong>
            <div className="detalles-list">
              {detallesArray.map((detalle, index) => (
                <div key={index} className="detalle-item">
                  <FaCircle className="check-icon" /> {detalle}
                </div>
              ))}
            </div>
          </div>
          <div
            className="form-actions"
            style={{ display: "flex", marginTop: "2rem" }}
          >
            <button
              onClick={handleMostrarContactoProducto}
              className="form-submit-custom"
            >
              Dejá tu consulta por este producto
            </button>
          </div>
          <br />
          {contactoProducto && (
            <div className="modal">
              <ContactoProducto
                id={id}
                handleCerrarContactoProducto={handleCerrarContactoProducto}
                familia={familia}
                marca={marca}
                modelo={modelo}
              />
            </div>
          )}
        </div>
      </div>

      {busquedaActiva && (
        <div ref={cardsContainerRef} className="cards-container" id="card">
          {productos?.length > 0 ? (
            productos.map((maquina) => (
              <Card
                id="cards"
                key={maquina.id}
                {...maquina}
                scrollToCarousel={scrollToCarousel}
              />
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
      )}
      <div className="whatsapp">
        <a
          href="https://wa.me/1159249700"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp size={60} />
        </a>
      </div>
    </Layout>
  );
}
