import React from "react";

const Dropdown = ({ children, handleClick }) => {
  return (
    <div className="dropdown-center dropdown">
      <button
        className="btn dropdown-toggle dropdown-button"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={handleClick}
      >
        Seleccionar
      </button>
      <div
        className="dropdown-menu dropdown-w"
        aria-labelledby="dropdownMenuButton"
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
