import React, { useState, useEffect } from "react";
import { useUsuario } from "../../hooks/useUsuarios";
import useAuth from "../../hooks/useAuth";
import { useCotizacionIndividual } from "../../hooks/useCotizacionIndividual";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBox,
  FaFileInvoiceDollar,
  FaShoppingCart,
  FaAngleDown,
  FaArrowLeft,
  FaEnvelope,
} from "react-icons/fa";
import { MdPerson } from "react-icons/md";

const SideBarResponsiva = ({ handleCerrarModalSideBar }) => {
  const { auth } = useAuth();
  const token = localStorage.getItem("token");
  const idUsuario = token;
  const { mutate: checkRol, data: rolData } = useUsuario().CheckRolMutation;

  const { data: countData } = useCotizacionIndividual().countEstado3;
  const count = countData?.count || 0;

  const navigate = useNavigate();

  const handleCheckRol = async () => {
    try {
      await checkRol({ idUsuario });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (idUsuario) {
      handleCheckRol();
    }
  }, [idUsuario]);

  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(null);
  const role = rolData?.data.rol;

  const categories = [
    {
      label: "Usuarios",
      icon: MdPerson,
      subCategories: [],
      roles: ["administrador", "gerente"],
    },
    {
      label: "Clientes",
      icon: FaUsers,
      subCategories: [
        {
          label: "Cargar clientes",
          path: "/admin/clientes/cargar",
          roles: ["administrador", "vendedor", "gerente"],
        },
        {
          label: "Ver clientes",
          path: "/admin/clientes/ver",
          roles: ["administrador", "vendedor", "gerente"],
        },
      ],
      roles: ["administrador", "vendedor", "gerente"],
    },
    {
      label: "Productos",
      icon: FaBox,
      subCategories: [
        {
          label: "Cargar productos",
          path: "/admin/productos/cargar",
          roles: ["administrador", "gerente"],
        },
        {
          label: "Ver productos",
          path: "/admin/productos/ver",
          roles: ["administrador", "vendedor", "gerente"],
        },
      ],
      roles: ["administrador", "vendedor", "gerente"],
    },
    {
      label: "Cotizaciones",
      icon: FaFileInvoiceDollar,
      subCategories: [
        {
          label: "Crear Cotizacion",
          path: "/admin/cotizaciones/crear",
          roles: ["administrador", "vendedor", "gerente"],
        },
        {
          label: "Ver Cotizaciones",
          path: "/admin/cotizaciones/ver",
          roles: ["administrador", "vendedor", "gerente"],
        },
        {
          label: "Historial Cotizaciones",
          path: "/admin/cotizaciones/historial",
          roles: ["administrador", "gerente"],
        },
      ],
      roles: ["administrador", "vendedor", "gerente"],
    },
    {
      label: "Ventas",
      icon: FaShoppingCart,
      subCategories: [
        {
          label: "Mis Ventas",
          path: "/admin/ventas/ver",
          roles: ["administrador", "vendedor"],
        },
        {
          label: "Pendientes de Aprobación",
          path: "/admin/ventas/aprobar",
          roles: ["administrador"],
        },
      ],
      roles: ["administrador", "vendedor", "gerente"],
    },
    {
      label: "Notificar",
      icon: FaEnvelope,
      subCategories: [
        {
          label: "Emails",
          path: "/admin/Notificaciones/Emails",
          roles: ["administrador", "vendedor", "gerente"],
        },
        // {
        //   label: "WhatsApp",
        //   path: "/admin/Notificaciones/WhatsApp",
        //   roles: ["administrador", "vendedor", "gerente"],
        // },
      ],
      roles: ["administrador", "vendedor", "gerente"],
    },
  ];

  const filteredCategories = categories.filter((category) =>
    category.roles.includes(role)
  );

  return (
    <div className="admin-layout">
      <div className="sidebarAdminResponsiva bg-dark">
        <div className="flechaizquierda">
          <FaArrowLeft
            onClick={handleCerrarModalSideBar}
            className="botonflecha"
          />
        </div>
        <div className="text-start px-3">
          <Link
            to="/admin"
            className={`sidebarAdmin__button ${
              location.pathname === "/admin" ? "active" : ""
            }`}
            onClick={() => {
              setActiveCategory(null);
              handleCerrarModalSideBar();
            }}
          >
            <FaHome className="icon me-2" />
            Home
          </Link>

          {filteredCategories.map((category) => (
            <div key={category.label}>
              {category.subCategories.length > 0 ? (
                <div>
                  <a
                    aria-controls={`collapse${category.label}`}
                    aria-expanded={
                      activeCategory === category ? "true" : "false"
                    }
                    data-bs-toggle="collapse"
                    href={`#collapse${category.label}`}
                    role="button"
                    onClick={() =>
                      setActiveCategory(
                        activeCategory === category ? null : category
                      )
                    }
                    className="sidebarAdmin__button d-flex align-items-center justify-content-between"
                  >
                    <div className="d-flex align-items-center">
                      <category.icon className="icon me-2" />
                      <span>{category.label}</span>
                    </div>
                    <FaAngleDown
                      className={`arrow-icon ${
                        activeCategory === category ? "show" : ""
                      }`}
                    />
                  </a>
                  <div
                    className={`collapse ${
                      activeCategory === category ? "show" : ""
                    }`}
                    id={`collapse${category.label}`}
                  >
                    {category.subCategories
                      .filter((subCategory) => subCategory.roles.includes(role))
                      .map((subCategory) => (
                        <Link
                          key={subCategory.label}
                          to={subCategory.path}
                          className={`sidebarAdmin__button ${
                            location.pathname === subCategory.path
                              ? "active"
                              : ""
                          }`}
                          onClick={() => {
                            setActiveCategory(null);
                            handleCerrarModalSideBar();
                          }}
                        >
                          {subCategory.label}
                          {subCategory.label === "Pendientes de Aprobación" &&
                            count > 0 && <span className="badge">{count}</span>}
                        </Link>
                      ))}
                  </div>
                </div>
              ) : (
                <Link
                  to={`/admin/${category.label.toLowerCase()}`}
                  className={`sidebarAdmin__button ${
                    location.pathname ===
                    `/admin/${category.label.toLowerCase()}`
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setActiveCategory(null);
                    handleCerrarModalSideBar();
                  }}
                >
                  <category.icon className="icon me-2" />
                  {category.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBarResponsiva;
