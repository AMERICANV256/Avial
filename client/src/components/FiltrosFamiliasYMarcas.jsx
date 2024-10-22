import React from "react";

export default function FiltrosFamiliasYMarcas({
  onSelectFamilia,
  onClose,
  handleCerrarModalHeadBar,
}) {
  const handleFamiliaClick = (familia) => {
    onSelectFamilia(familia);
    handleCerrarModalHeadBar();
    onClose();
  };

  return (
    <div className="dropdownEquipos">
      <button onClick={() => handleFamiliaClick("Autoelevadores")}>
        <span>AUTOELEVADORES</span>
      </button>
      <button onClick={() => handleFamiliaClick("Bomba de Hormigon")}>
        <span>BOMBA DE HORMIGON</span>
      </button>
      <button
        onClick={() => handleFamiliaClick("Bomba de Hormigon sobre Camion")}
      >
        <span>BOMBA DE HORMIGON SOBRE CAMION</span>
      </button>
      <button onClick={() => handleFamiliaClick("Camion Articulado")}>
        <span>CAMION ARTICULADO</span>
      </button>
      <button onClick={() => handleFamiliaClick("Camion Minero")}>
        <span>CAMION MINERO</span>
      </button>
      <button onClick={() => handleFamiliaClick("Excavadora")}>
        <span>EXCAVADORA</span>
      </button>
      <button onClick={() => handleFamiliaClick("Excavadora Minera")}>
        <span>EXCAVADORA MINERA</span>
      </button>
      <button onClick={() => handleFamiliaClick("Fresadora")}>
        <span>FRESADORA</span>
      </button>
      <button onClick={() => handleFamiliaClick("Gruas")}>
        <span>GRUAS</span>
      </button>

      <button onClick={() => handleFamiliaClick("Manipuladores Magni")}>
        <span>MANIPULADORES MAGNI</span>
      </button>
      <button onClick={() => handleFamiliaClick("Minicargadora")}>
        <span>MINICARGADORA</span>
      </button>
      <button onClick={() => handleFamiliaClick("Minirodillo")}>
        <span>MINIRODILLO</span>
      </button>
      <button onClick={() => handleFamiliaClick("Motoniveladora")}>
        <span>MOTONIVELADORA</span>
      </button>
      <button onClick={() => handleFamiliaClick("Pala Cargadora")}>
        <span>PALA CARGADORA</span>
      </button>
      <button onClick={() => handleFamiliaClick("Pilotera")}>
        <span>PILOTERA</span>
      </button>
      <button onClick={() => handleFamiliaClick("Plataformas Articuladas")}>
        <span>PLATAFORMAS ARTICULADAS</span>
      </button>
      <button onClick={() => handleFamiliaClick("Porta Contenedor")}>
        <span>PORTACONTENEDOR</span>
      </button>
      <button onClick={() => handleFamiliaClick("Retro Excavadora")}>
        <span>RETROEXCAVADORA</span>
      </button>
      <button onClick={() => handleFamiliaClick("Rodillo Compactador")}>
        <span>RODILLO COMPACTADOR</span>
      </button>
      <button onClick={() => handleFamiliaClick("Rodillo Doble Liso")}>
        <span>RODILLO DOBLE LISO</span>
      </button>
      <button onClick={() => handleFamiliaClick("Rodillo Neumatico")}>
        <span>RODILLO NEUMATICO</span>
      </button>
      <button onClick={() => handleFamiliaClick("Terminadora Asfalto")}>
        <span>TERMINADORA ASFALTO</span>
      </button>
      <button onClick={() => handleFamiliaClick("Topadora")}>
        <span>TOPADORA</span>
      </button>
      <button onClick={() => handleFamiliaClick("Trompo Hormigonero")}>
        <span>TROMPO HORMIGONERO</span>
      </button>
      <button onClick={() => handleFamiliaClick("Tunelera Horizontal")}>
        <span>TUNELERA HORIZONTAL</span>
      </button>
    </div>
  );
}
