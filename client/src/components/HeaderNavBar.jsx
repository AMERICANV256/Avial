import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FiltrosFamiliasYMarcas from "../components/FiltrosFamiliasYMarcas";

export default function HeaderNavBar({
  handleCerrarModalHeadBar,
  onSelectFamilia,
}) {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  const [isEmpresaDropdownOpen, setIsEmpresaDropdownOpen] = useState(false);
  const [isEquiposDropdownOpen, setIsEquiposDropdownOpen] = useState(false);

  const handleEmpresaMouseEnter = () => {
    setIsEmpresaDropdownOpen(true);
  };

  const handleEmpresaMouseLeave = () => {
    setIsEmpresaDropdownOpen(false);
  };

  const handleEquiposMouseEnter = () => {
    setIsEquiposDropdownOpen(true);
  };

  const handleEquiposMouseLeave = () => {
    setIsEquiposDropdownOpen(false);
  };

  return (
    <div>
      <div>
        <button onClick={navigateToHome}>Home</button>
        <div
          onMouseEnter={handleEquiposMouseEnter}
          onMouseLeave={handleEquiposMouseLeave}
          className="empresaButtonWrapper"
        >
          <button>Equipos</button>
          {isEquiposDropdownOpen && (
            <div className="filtrosContainer">
              <FiltrosFamiliasYMarcas
                onSelectFamilia={onSelectFamilia}
                onClose={() => setIsEquiposDropdownOpen(false)}
                handleCerrarModalHeadBar={handleCerrarModalHeadBar}
              />
            </div>
          )}
        </div>
        <div
          onMouseEnter={handleEmpresaMouseEnter}
          onMouseLeave={handleEmpresaMouseLeave}
          className="empresaButtonWrapper"
        >
          <button>Empresa</button>
          {isEmpresaDropdownOpen && (
            <div className="dropdownEmpresa">
              <button onClick={() => navigate("/postventa")}>PostVenta</button>
              <button onClick={() => navigate("/distribuidores")}>
                Distribuidores
              </button>
              <button onClick={() => navigate("/financiacion")}>
                Financiación
              </button>
              <button onClick={() => navigate("/americanrepuestos")}>
                Repuestos
              </button>
              <button onClick={() => navigate("/novedades")}>Novedades</button>
              <button onClick={() => navigate("/americanContacto")}>
                Contacto
              </button>
            </div>
          )}
        </div>
        <button onClick={() => navigate("/americanGarantia")}>Garantia</button>
      </div>
    </div>
  );
}
