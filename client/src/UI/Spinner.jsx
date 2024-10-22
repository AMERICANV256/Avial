import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

function Spinner({ loading }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9998,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <BeatLoader
          color="#ffc107"
          size={40}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <span
          style={{
            display: "block",
            fontSize: "20px",
            marginTop: "10px",
            color: "#fff",
          }}
        >
          Cargando...
        </span>
      </div>
    </div>
  );
}

export default Spinner;
