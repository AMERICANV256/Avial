import React from "react";
import { Link } from "react-router-dom";
import little from "../assets/img/LITTLE VENICE/little.png";
import venice from "../assets/img/marca6.png";

export default function Landing() {
  return (
    <div className="landing">
      <Link to="/venice">
        <div className="button-landing left">
          <button>
            <img src={venice} alt="Venice" className="button-image" />
          </button>
        </div>
      </Link>
      <Link to="/littleVenice">
        <div className="button-landing right">
          <button>
            <img src={little} alt="Little Venice" className="button-image" />
          </button>
        </div>
      </Link>
    </div>
  );
}
