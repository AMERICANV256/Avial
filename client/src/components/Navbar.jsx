import React from "react";
import "../App.css";
import AUTOELEVADOR2 from "../assets/img/FAMILIAS/AUTOELEVADOR2-4.jpg";
import AUTOELEVADOR5 from "../assets/img/FAMILIAS/AUTOELEVADOR5-10.jpg";
import AUTOELEVADOR10 from "../assets/img/FAMILIAS/AUTOELEVADOR10.jpg";
import BOMBAHORMIGON from "../assets/img/FAMILIAS/BOMBAHORMIGON.jpg";
import BOMBAHORMIGONSOBRECAMION from "../assets/img/FAMILIAS/BOMBAHORMIGONSOBRECAMION.jpg";
import CAMIONARTICULADO from "../assets/img/FAMILIAS/CAMIONARTICULADO.jpg";
import CAMIONMINERO from "../assets/img/FAMILIAS/CAMIONMINERO.jpg";
import EXCAVADORA from "../assets/img/CAROUSEL/excavadorahome.png";
import EXCAVADORACARD from "../assets/img/FAMILIAS/EXCAVADORA.jpg";
import EXCAVADORAMINERA from "../assets/img/FAMILIAS/EXCAVADORAMINERA.jpg";
import FRESADORAHOME from "../assets/img/CAROUSEL/FRESADORAHOME.png";
import GRUASRT from "../assets/img/FAMILIAS/GRUASRT.jpg";
import GRUASSOBRECAMION from "../assets/img/FAMILIAS/GRUASSOBRECAMION.jpg";
import GRUASTODOTORRENO from "../assets/img/FAMILIAS/GRUASTODOTERRENO.jpg";
import MANIPULADORESMAGNI from "../assets/img/CAROUSEL/manipulador.png";
import MINICARGADORA from "../assets/img/CAROUSEL/minicargadora.png";
import MINIRODILLO from "../assets/img/FAMILIAS/MINIRODILLO.jpg";
import MOTONIVELADORA from "../assets/img/CAROUSEL/motoniveladora.png";
import PALACARGADORA from "../assets/img/FAMILIAS/PALACARGADORA.jpg";
import PILOTERA from "../assets/img/FAMILIAS/PILOTERA.jpg";
import PLATAFORMASARTICULADAS from "../assets/img/FAMILIAS/PLATAFORMASARTICULADAS.jpg";
import PORTACONTENEDOR from "../assets/img/FAMILIAS/PORTACONTENEDOR.jpg";
import RETROEXCAVADORA from "../assets/img/FAMILIAS/RETROEXCAVADORA.jpg";
import RODILLOCOMPACTADOR from "../assets/img/FAMILIAS/RODILLOCOMPACTADOR.jpg";
import RODILLODOBLELISO from "../assets/img/FAMILIAS/RODILLODOBLELISO.jpg";
import RODILLONEUMATICO from "../assets/img/FAMILIAS/RODILLONEUMATICO.jpg";
import TERMINADORAASFALTO from "../assets/img/FAMILIAS/TERMINADORAASFALTO.jpg";
import TOPADORA from "../assets/img/FAMILIAS/TOPADORA.jpg";
import TROMPOHORMIGONERO from "../assets/img/FAMILIAS/TROMPOHORMIGONERO.jpg";
import TUNELERAHORIZONTAL from "../assets/img/FAMILIAS/TUNELERAHORIZONTAL.jpg";
import GRUAIMAGE from "../assets/img/CAROUSEL/gruashome.png";
import CAMIONIMAGE from "../assets/img/CAROUSEL/camionminerohome.png";
import AUTOELEVADOR from "../assets/img/CAROUSEL/autoelevador.png";
import EXCAVADORAHOME from "../assets/img/CAROUSEL/excavadorahome.png";
import BOMBAHORMIGONHOME from "../assets/img/CAROUSEL/bombahormigon.png";
import RODILLOHOME from "../assets/img/CAROUSEL/rodillo.png";
import TOPADORAHOME from "../assets/img/CAROUSEL/topadora.png";

export default function NavBar({ onSelectFamilia }) {
  const handleFamiliaClick = (familia) => {
    onSelectFamilia(familia);
  };

  return (
    <div className="navbar">
      <div className="tituloHome">
        <h1>EL PODER DE UNA MARCA </h1> <h2> LA GARANTÍA DEL LÍDER</h2>
      </div>
      <div className="containerFamiliaHome">
        <div className="letrasHome">
          <h1>GRÚAS</h1>
        </div>

        <div className="imageHome">
          <img src={GRUAIMAGE} alt="" />
          <a
            aria-controls="collapseGruas"
            aria-expanded="false"
            className="nav-link dropdown-toggle"
            data-bs-toggle="collapse"
            href="#collapseGruas"
            role="button"
          ></a>
        </div>
      </div>

      <div className="categoriasContainer collapse" id="collapseGruas">
        <div>
          <button className="marca" onClick={() => handleFamiliaClick("Gruas")}>
            <img src={GRUASRT} alt="GRUASRT" />
          </button>
        </div>
        <div>
          <button className="marca" onClick={() => handleFamiliaClick("Gruas")}>
            <img src={GRUASSOBRECAMION} alt="GRUASSOBRECAMION" />
          </button>
        </div>
        <div>
          <button className="marca" onClick={() => handleFamiliaClick("Gruas")}>
            <img src={GRUASTODOTORRENO} alt="GRUASTODOTORRENO" />
          </button>
        </div>
      </div>
      <div className="containerFamiliaHome">
        <div className="letrasHome">
          <h1>CAMIONES</h1>
        </div>
        <div className="imageHome">
          {" "}
          <img src={CAMIONIMAGE} alt="" />
          <a
            aria-controls="collapseCamion"
            aria-expanded="false"
            className="nav-link dropdown-toggle"
            data-bs-toggle="collapse"
            href="#collapseCamion"
            role="button"
          ></a>
        </div>
      </div>
      <div className="categoriasContainer collapse" id="collapseCamion">
        <div>
          <button
            className="marca"
            onClick={() => handleFamiliaClick("CAMIONARTICULADO")}
          >
            <img src={CAMIONARTICULADO} alt="CAMIONARTICULADO" />
          </button>
        </div>
        <div>
          <button
            className="marca"
            onClick={() => handleFamiliaClick("CAMIONMINERO")}
          >
            <img src={CAMIONMINERO} alt="CAMIONMINERO" />
          </button>
        </div>
      </div>

      <div className="containerFamiliaHome">
        <div className="letrasHome">
          <h1>AUTO</h1>
          <h1>ELEVADORES</h1>
        </div>

        <div className="imageHome">
          <img src={AUTOELEVADOR} alt="" />
          <a
            aria-controls="collapseAutoelevadores"
            aria-expanded="false"
            className="nav-link dropdown-toggle"
            data-bs-toggle="collapse"
            href="#collapseAutoelevadores"
            role="button"
          ></a>
        </div>
      </div>

      <div className="categoriasContainer collapse" id="collapseAutoelevadores">
        <button
          className="marca"
          onClick={() => handleFamiliaClick("AUTOELEVADOR2-4")}
        >
          <img src={AUTOELEVADOR2} alt="AUTOELEVADOR2-4" />
        </button>
        <button
          className="marca"
          onClick={() => handleFamiliaClick("AUTOELEVADOR5-10")}
        >
          <img src={AUTOELEVADOR5} alt="AUTOELEVADOR5-10" />
        </button>
        <button
          className="marca"
          onClick={() => handleFamiliaClick("AUTOELEVADOR10")}
        >
          <img src={AUTOELEVADOR10} alt="AUTOELEVADOR10" />
        </button>
      </div>

      <div className="containerFamiliaHome">
        <div className="letrasHome">
          <h1>EXCAVADORAS</h1>
        </div>

        <div className="imageHome">
          <img src={EXCAVADORAHOME} alt="" />
          <a
            aria-controls="collapseExcavadoras"
            aria-expanded="false"
            className="nav-link dropdown-toggle"
            data-bs-toggle="collapse"
            href="#collapseExcavadoras"
            role="button"
          ></a>
        </div>
      </div>

      <div className="categoriasContainer collapse" id="collapseExcavadoras">
        <button
          className="marca"
          onClick={() => handleFamiliaClick("EXCAVADORA")}
        >
          <img src={EXCAVADORACARD} alt="EXCAVADORA" />
        </button>

        <button
          className="marca"
          onClick={() => handleFamiliaClick("EXCAVADORAMINERA")}
        >
          <img src={EXCAVADORAMINERA} alt="EXCAVADORAMINERA" />
        </button>
      </div>

      <div className="containerFamiliaHome">
        <div className="letrasHome">
          <h1>BOMBAS</h1>
          <h1>DE</h1>
          <h1>HORMIGON</h1>
        </div>

        <div className="imageHome">
          <img src={BOMBAHORMIGONHOME} alt="" />
          <a
            aria-controls="collapseBombas"
            aria-expanded="false"
            className="nav-link dropdown-toggle"
            data-bs-toggle="collapse"
            href="#collapseBombas"
            role="button"
          ></a>
        </div>
      </div>

      <div className="categoriasContainer collapse" id="collapseBombas">
        <button
          className="marca"
          onClick={() => handleFamiliaClick("BOMBAHORMIGON")}
        >
          <img src={BOMBAHORMIGON} alt="BOMBAHORMIGON" />
        </button>
        <button
          className="marca"
          onClick={() => handleFamiliaClick("BOMBAHORMIGONSOBRECAMION")}
        >
          <img src={BOMBAHORMIGONSOBRECAMION} alt="BOMBAHORMIGONSOBRECAMION" />
        </button>
      </div>

      <div className="containerFamiliaHome">
        <div className="letrasHome">
          <h1>RODILLOS</h1>
        </div>

        <div className="imageHome">
          <img src={RODILLOHOME} alt="" />
          <a
            aria-controls="collapseRodillos"
            aria-expanded="false"
            className="nav-link dropdown-toggle"
            data-bs-toggle="collapse"
            href="#collapseRodillos"
            role="button"
          ></a>
        </div>
      </div>

      <div className="categoriasContainer collapse" id="collapseRodillos">
        <button
          className="marca"
          onClick={() => handleFamiliaClick("RODILLOCOMPACTADOR")}
        >
          <img src={RODILLOCOMPACTADOR} alt="RODILLOCOMPACTADOR" />
        </button>
        <button
          className="marca"
          onClick={() => handleFamiliaClick("RODILLODOBLELISO")}
        >
          <img src={RODILLODOBLELISO} alt="RODILLODOBLELISO" />
        </button>
        <button
          className="marca"
          onClick={() => handleFamiliaClick("RODILLONEUMATICO")}
        >
          <img src={RODILLONEUMATICO} alt="RODILLONEUMATICO" />
        </button>
        <button
          className="marca"
          onClick={() => handleFamiliaClick("MINIRODILLO")}
        >
          <img src={MINIRODILLO} alt="MINIRODILLO" />
        </button>
      </div>

      {/* A PARTIR DE ACA HACER LAS IMAGENES GRANDES DE CADA BOTON Y ABAJO DE TODO LAS NOVEDADES  */}
      <div className="descripcionesHome">
        <h3>American VIAL comercializa maquinarias viales</h3>
        <h3>para la construcción y el campo y todo tipo de empresa.</h3>
        <h3>Cuenta con un stock permanente en su planta de Don Torcuato.</h3>
      </div>

      <button
        className="CARDHOMEIMAGENSOLA"
        onClick={() => handleFamiliaClick("TOPADORA")}
      >
        <img src={TOPADORAHOME} alt="TOPADORA" />

        <div className="letrasHomefOTOSOLA">
          <h1>TOPADORAS</h1>
          <a className="nav-link dropdown-toggle" role="button"></a>
        </div>
      </button>

      <button
        className="CARDHOMEIMAGENSOLA"
        onClick={() => handleFamiliaClick("FRESADORA")}
      >
        <div className="letrasHomefOTOSOLASACAR">
          <h1>FRESADORAS</h1>
          <a className="nav-link dropdown-toggle" role="button"></a>
        </div>
        <img src={FRESADORAHOME} alt="FRESADORA" />
        <div className="letrasHomefOTOSOLAdebajo">
          <h1>FRESADORAS</h1>
          <a className="nav-link dropdown-toggle" role="button"></a>
        </div>
      </button>

      <button
        className="CARDHOMEIMAGENSOLA"
        onClick={() => handleFamiliaClick("MANIPULADORESMAGNI")}
      >
        <img src={MANIPULADORESMAGNI} alt="MANIPULADORESMAGNI" />
        <div className="letrasHomefOTOSOLA">
          <h1>MANIPULADORES MAGNI</h1>
          <a className="nav-link dropdown-toggle" role="button"></a>
        </div>
      </button>

      <button
        className="CARDHOMEIMAGENSOLA"
        onClick={() => handleFamiliaClick("MINICARGADORA")}
      >
        <div className="letrasHomefOTOSOLASACAR">
          <h1>MINI CARGADORAS</h1>
          <a className="nav-link dropdown-toggle" role="button"></a>
        </div>
        <img src={MINICARGADORA} alt="MINICARGADORA" />
        <div className="letrasHomefOTOSOLAdebajo">
          <h1>MINI CARGADORAS</h1>
          <a className="nav-link dropdown-toggle" role="button"></a>
        </div>
      </button>

      <button
        className="CARDHOMEIMAGENSOLA"
        onClick={() => handleFamiliaClick("MOTONIVELADORA")}
      >
        <img src={MOTONIVELADORA} alt="MOTONIVELADORA" />
        <div className="letrasHomefOTOSOLA">
          <h1>MOTO</h1>
          <h1>NIVELADORAS</h1>
          <a className="nav-link dropdown-toggle" role="button"></a>
        </div>
      </button>

      <div className="descripcionesHome">
        <h3>Consolida su liderazgo en ventas</h3>
        <h3>con una atención de Post-Venta desde principio a fin,</h3>
        <h3>
          contando con recursos y repuestos para darle tranquilidad a su compra.
        </h3>
      </div>

      <div className="grid-container">
        <button
          className="marca"
          onClick={() => handleFamiliaClick("PALACARGADORA")}
        >
          <img src={PALACARGADORA} alt="PALACARGADORA" />
        </button>
        <button
          className="marca"
          onClick={() => handleFamiliaClick("PILOTERA")}
        >
          <img src={PILOTERA} alt="PILOTERA" />
        </button>
        <button
          className="marca"
          onClick={() => handleFamiliaClick("PLATAFORMASARTICULADAS")}
        >
          <img src={PLATAFORMASARTICULADAS} alt="PLATAFORMASARTICULADAS" />
        </button>
        <button
          className="marca"
          onClick={() => handleFamiliaClick("PORTACONTENEDOR")}
        >
          <img src={PORTACONTENEDOR} alt="PORTACONTENEDOR" />
        </button>
        <button
          className="marca"
          onClick={() => handleFamiliaClick("RETROEXCAVADORA")}
        >
          <img src={RETROEXCAVADORA} alt="RETROEXCAVADORA" />
        </button>

        <button
          className="marca"
          onClick={() => handleFamiliaClick("TERMINADORAASFALTO")}
        >
          <img src={TERMINADORAASFALTO} alt="TERMINADORAASFALTO" />
        </button>

        <button
          className="marca"
          onClick={() => handleFamiliaClick("TROMPOHORMIGONERO")}
        >
          <img src={TROMPOHORMIGONERO} alt="TROMPOHORMIGONERO" />
        </button>
        <button
          className="marca"
          onClick={() => handleFamiliaClick("TUNELERAHORIZONTAL")}
        >
          <img src={TUNELERAHORIZONTAL} alt="TUNELERAHORIZONTAL" />
        </button>
      </div>
    </div>
  );
}
