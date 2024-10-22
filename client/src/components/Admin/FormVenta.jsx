import React, { useState, useEffect } from "react";
import { useVenta } from "../../hooks/useVentas";
import { useProducto } from "../../hooks/useProductos";

export default function FormVenta({ handleCerrarFormulario }) {
  const [formData, setFormData] = useState({
    marca: "",
    codigo: "",
    costo: 0,
    precio: 0,
    cuota1: 0,
    cuota2: 0,
    saldo: 0,
    comprador: "",
    vendedor: "",
    fecha: new Date().toISOString().slice(0, 10), // Fecha actual en formato YYYY-MM-DD
  });

  const { mutate } = useVenta().ventaMutation;

  const { data, isLoading, refetch } = useProducto().productosventasQuery;

  const handleCodigoChange = (event) => {
    const selectedIndex = event.target.value;
    const selectedProduct = data[selectedIndex];
    if (selectedProduct) {
      setFormData({
        ...formData,
        marca: selectedProduct.marca,
        precio: selectedProduct.precio,
        codigo: selectedProduct.codigo,
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    mutate(formData);
    refetch();
  };

  return (
    <div className="FormProducto">
      <div className="formCerrarProducto">
        <button onClick={handleCerrarFormulario}>x</button>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="codigo">Código:</label>
        <select
          id="codigo"
          name="codigo"
          value={formData.codigo}
          onChange={handleCodigoChange}
        >
          <option value="">Selecciona un código</option>
          {isLoading ? (
            <option disabled>Cargando...</option>
          ) : (
            data.map((product, index) => (
              <option key={index} value={index}>
                {product.codigo}
              </option>
            ))
          )}
        </select>

        <label htmlFor="marca">Marca:</label>
        <input
          style={{ color: "black" }}
          type="text"
          id="marca"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          disabled
        />

        <label htmlFor="precio">Precio:</label>
        <input
          style={{ color: "black" }}
          type="number"
          id="precio"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          disabled
        />

        <label htmlFor="costo">Costo:</label>
        <input
          type="number"
          id="costo"
          name="costo"
          value={formData.costo}
          onChange={handleChange}
        />

        <label htmlFor="cuota1">Cuota 1:</label>
        <input
          type="number"
          id="cuota1"
          name="cuota1"
          value={formData.cuota1}
          onChange={handleChange}
        />

        <label htmlFor="cuota2">Cuota 2:</label>
        <input
          type="number"
          id="cuota2"
          name="cuota2"
          value={formData.cuota2}
          onChange={handleChange}
        />

        <label htmlFor="saldo">Saldo:</label>
        <input
          type="number"
          id="saldo"
          name="saldo"
          value={formData.saldo}
          onChange={handleChange}
        />

        <label htmlFor="comprador">Comprador:</label>
        <input
          type="text"
          id="comprador"
          name="comprador"
          value={formData.comprador}
          onChange={handleChange}
        />

        <label htmlFor="vendedor">Vendedor:</label>
        <input
          type="text"
          id="vendedor"
          name="vendedor"
          value={formData.vendedor}
          onChange={handleChange}
        />
        <div className="agregarProducto">
          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
  );
}
