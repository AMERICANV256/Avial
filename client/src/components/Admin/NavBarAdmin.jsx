import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/img/LOGOAMERICANPRINCIPAL.png";
import { FaBars } from "react-icons/fa";
import SideBarResponsiva from "./SideBarResponsiva";
import EditarUsuario from "../usuario/EditarUsuario";

export default function NavBarAdmin() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const token = localStorage.getItem("token");
  const idUsuario = token;

  const [sidebar, setSideBar] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setAuth({});
    navigate("/");
  };

  const handleMostrarModalEdit = () => {
    setEdit(true);
  };

  const handleCerrarModalEdit = () => {
    setEdit(false);
  };

  const handleMostrarModalSideBar = () => {
    setIsHovered(true);
    setSideBar(true);
  };

  const handleCerrarModalSideBar = () => {
    setSideBar(false);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleButtonClick = () => {
    navigate("/admin");
  };

  const updateAuthFromLocalStorage = () => {
    const nombre = localStorage.getItem("nombre");
    const apellido = localStorage.getItem("apellido");

    if (nombre && apellido) {
      setAuth({
        nombre: nombre,
        apellido: apellido,
      });
      setLoading(false); // Deja de mostrar el mensaje de carga cuando se actualice el estado
    }
  };

  useEffect(() => {
    // Actualiza auth cuando el componente se monte
    updateAuthFromLocalStorage();

    // Configura un intervalo para verificar cambios en localStorage
    const intervalId = setInterval(updateAuthFromLocalStorage, 1000); // Cada segundo

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [setAuth]);

  return (
    <nav className="navbarAdmin">
      {/* <div className="grua-container">
        <img src={gruagif} alt="" className="grua-img" />
      </div> */}

      <div className="sidebarAdmin__header">
        {sidebar && (
          <div className="sidebarAdminResponsivo">
            <SideBarResponsiva
              handleCerrarModalSideBar={handleCerrarModalSideBar}
            />
          </div>
        )}
        <button onClick={handleButtonClick} className="topadmin__button">
          <img src={logo} alt="chef" className="sidebarAdmin__image" />
          <div>
            <h1 className="navbarAdmin__title">Panel de Administrador</h1>
          </div>
        </button>
      </div>

      <div onClick={handleMostrarModalEdit} className="user__info">
        {auth.nombre} {auth.apellido}
        {!sidebar && (
          <button
            onClick={(event) => {
              event.stopPropagation();
              handleMostrarModalSideBar();
            }}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMostrarModalSideBar}
            className="burguer"
            style={{
              fontSize: "25px",
              position: "absolute",
              right: "0px",
              top: "85px",
              background: "none",
            }}
          >
            <FaBars className="burguer-icon" style={{ color: "white" }} />
          </button>
        )}
      </div>
      <button
        style={{
          background: "none",
          backgroundColor: "none",
          color: "gray",
          position: "absolute",
          top: 0,
          right: 0,
        }}
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>

      {edit && (
        <div>
          <EditarUsuario
            handleMostrarModalEdit={handleMostrarModalEdit}
            handleCerrarModalEdit={handleCerrarModalEdit}
          />
        </div>
      )}
    </nav>
  );
}
