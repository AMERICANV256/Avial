import React, { useState, useEffect } from "react";
import CardAmpliada from "./CardAmpliada";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Card = ({
  id,
  familia,
  marca,
  modelo,
  imagen,
  imagen1,
  scrollToCarousel,
}) => {
  const [currentImage, setCurrentImage] = useState(imagen);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleDetalleClick = () => {
    navigate(`/productos/${id}`);
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleMouseOver = () => {
    setCurrentImage(imagen1);
  };

  const handleMouseOut = () => {
    setCurrentImage(imagen);
  };

  const handleTouchStart = () => {
    setCurrentImage(imagen1);
  };

  const handleTouchEnd = () => {
    setCurrentImage(imagen);
  };

  return (
    <div
      className="card"
      id={id}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="image-container">
        <img
          src={currentImage}
          alt=""
          className="card-image"
          onClick={handleImageClick}
        />
        <button
          className="verdetalle"
          onClick={() => {
            handleDetalleClick();
            scrollToCarousel();
          }}
        >
          <FaSearch className="lupa" />
          Detalle
        </button>
      </div>

      <div className="card-content">
        <p>{familia ? familia : null} </p>
        <p style={{ fontSize: "14px" }}>{marca ? marca : null} </p>
        <p>{modelo ? modelo : null} </p>
      </div>
    </div>
  );
};
export default Card;
