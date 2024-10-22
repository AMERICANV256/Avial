import React, { useState } from "react";
import AboutUs from "../components/AboutUs";
import Contact from "../components/Contact";
import MAPS from "../assets/img/MAPS.png";
import { FaXTwitter } from "react-icons/fa6";
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";
import Modal from "react-modal";
import Garantia from "../components/Garantia";
import DatosContacto from "./DatosContacto";
import RepuestoForm from "../components/RepuestoForm";
import CarouselMarcas from "../components/CarouselMarcas";

Modal.setAppElement("#root");

export default function FooterAlternativo() {
  const [contact, setContact] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [garantia, setGarantia] = useState(false);
  const [repuesto, setRepuesto] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const currentYear = new Date().getFullYear();

  const handleMostrarModalGarantia = () => {
    setGarantia(true);
  };

  const handleCerrarModalGarantia = () => {
    setGarantia(false);
  };

  const handleMostrarModalAbout = () => {
    setModal(true);
  };

  const handleCerrarModalAbout = () => {
    setModal(false);
  };

  const handleMostrarModalContact = () => {
    setContact(true);
  };

  const handleCerrarModalContact = () => {
    setContact(false);
  };

  const handleMostrarModalRepuesto = () => {
    setRepuesto(true);
  };

  const handleCerrarModalRepuesto = () => {
    setRepuesto(false);
  };

  return (
    <div className="principal-footer">
      {/* <div style={{ backgroundColor: "white" }}>
        {" "}
        <CarouselMarcas />
      </div>

      <div className="footerAlternativo">
        <div className="faSpan">
          <h2>Contactános</h2>

          <p>
            ¡Gracias por visitar nuestro sitio! Si tienes alguna pregunta o
            comentario, no dudes en ponerte en contacto con nosotros.
          </p>
        </div>
        <br />
        <div className="footaltbespace">
          <div>
            <button onClick={handleMostrarModalContact}>Contacto</button>
          </div>
          <div>
            <button onClick={handleMostrarModalRepuesto}>Repuestos</button>
          </div>
          <div>
            <button onClick={handleMostrarModalGarantia}>Garantía</button>
          </div>
          <div>
            <button onClick={handleMostrarModalAbout}>Sobre Nosotros</button>
          </div>

          <br />
        </div>
        <br />
        <br />
        <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter size={40} color="#1DA1F2" />
          </a>
          <a
            href="https://instagram.com/americanvialgroup"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={40} color="#E4405F" />
          </a>
          <a
            href="https://www.facebook.com/americanvial/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={40} color="#1877F2" />
          </a>
          <a
            href="https://wa.me/1159249700"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={40} color="#25D366" />
          </a>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
            onClick={openModal}
          >
            <FaMapMarkerAlt size={40} color="#FF0000" />
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Location Modal"
            className="contact-container"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                zIndex: 1000,
              },
              content: {
                color: "black",
                maxWidth: "700px",
                height: "auto",
                width: "80%",
                margin: "auto",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1001,
              },
            }}
          >
            <div
              className="form-actions"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "-10px",
                marginBottom: "1rem",
              }}
            >
              <div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="button-cerrar"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <h4
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                textDecorationColor: "#febb00",
              }}
            >
              UBICACIÓN
            </h4>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Panamericana+Km+28.250,+Paris+256,+Don+Torcuato,+Buenos+Aires,+Argentina"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={MAPS} className="MAPS" alt="Ubicación en Google Maps" />
            </a>
            <p
              style={{ fontWeight: "bold", marginTop: "0.5rem", color: "grey" }}
            >
              Panamericana Km 28.250 – Paris 256 esq. Colectora Este,
            </p>
            <p style={{ fontWeight: "bold", color: "grey" }}>
              (1611) Don Torcuato – Prov. de Buenos Aires – ARGENTINA
            </p>
            <br />
          </Modal>
        </div>
      </div>
      {garantia && (
        <div className="modal">
          <Garantia handleCerrarModalGarantia={handleCerrarModalGarantia} />
        </div>
      )}
      {contact && (
        <div className="modal">
          <Contact handleCerrarModalContact={handleCerrarModalContact} />
        </div>
      )}
      {modal && (
        <div className="modal">
          <AboutUs handleCerrarModalAbout={handleCerrarModalAbout} />
        </div>
      )}
      {repuesto && (
        <div className="modal">
          <RepuestoForm handleCerrarModalRepuesto={handleCerrarModalRepuesto} />
        </div>
      )}

      <DatosContacto />

      <div className="copy">
        Copyright © {currentYear} | American Vial Todos los derechos reservados
      </div> */}
    </div>
  );
}

// COLLAPSE //

{
  /* <div>
<a
  aria-controls="collapseContact"
  aria-expanded="false"
  className="nav-link dropdown-toggle"
  data-bs-toggle="collapse"
  href="#collapseContact"
  role="button"
>
  <FaUsers className="sidebarIcons text-muted" size="1.50em" />{" "}
  Contacto
</a>
<div className="collapse" id="collapseContact">
  <Contact />
</div>
</div> */
}
