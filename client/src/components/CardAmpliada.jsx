import React, { useState } from "react";

export default function CardAmpliada({
  imagen,
  imagen1,
  modelo,
  marca,
  familia,
  onClose,
}) {
  const [currentImage, setCurrentImage] = useState(imagen);

  // pasar mouse por arriba
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
      className="CardAmpliada"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button onClick={onClose} style={{ color: "black" }}>
        X
      </button>
      <img src={currentImage} alt="Imagen ampliada" />
      <div>
        <span style={{ color: "black", fontWeight: "bold" }}>{familia}</span>
        <span style={{ color: "black", fontWeight: "bold" }}>{marca}</span>
        <span style={{ color: "black", fontWeight: "bold" }}>{modelo}</span>
      </div>
    </div>
  );
}
