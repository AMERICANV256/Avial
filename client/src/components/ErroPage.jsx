import React from "react";
import error from "../assets/img/error404.png";
import errorResponsivo from "../assets/img/error404responsivo.png";

export default function ErroPage() {
  return (
    <div className="fullscreen-image">
      <img className="responsivo" src={errorResponsivo} alt="ErrorR Image" />
      <img className="ordenador" src={error} alt="Error Image" />
    </div>
  );
}
