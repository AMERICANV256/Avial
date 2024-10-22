import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useClientes } from "../../hooks/useClientes";
import useAuth from "../../hooks/useAuth";
import BackButton from "../../UI/BackButton";
import { soloNumeros } from "../../utils/soloNumeros";
import Select from "react-select";

export default function ClientesEdit() {
  const { auth } = useAuth();
  const token = localStorage.getItem("token");
  const idUsuario = token;

  const { id } = useParams();

  const [formData, setFormData] = useState({
    id: id,
    idUsuario: idUsuario,
    CUIT: "",
    domicilio: "",
    nombre: "",
    apellido: "",
    mail: "",
    telefono: "",
    telefonoAlternativo: "",
    telefonoAlternativo1: "",
    razonSocial: "",
    mailAlternativo: "",
    mailAlternativo1: "",
    contactoAlternativo: "",
    contactoAlternativo1: "",
  });

  const {
    clientesQueryDetalle: { data: clienteDetalle, isLoading },
    clientesEditMutation: { mutate: ediCliente },
  } = useClientes(null, id);

  useEffect(() => {
    if (clienteDetalle) {
      setFormData({
        id: id,
        idUsuario: idUsuario,
        razonSocial: clienteDetalle.razonSocial || "",
        CUIT: clienteDetalle.CUIT || "",
        domicilio: clienteDetalle.domicilio || "",
        nombre: clienteDetalle.nombre || "",
        apellido: clienteDetalle.apellido || "",
        provincia: clienteDetalle.provincia || "",
        ciudad: clienteDetalle.ciudad || "",
        mail: clienteDetalle.mail || "",
        telefono: clienteDetalle.telefono || "",
        telefonoAlternativo: clienteDetalle.telefonoAlternativo || "",
        telefonoAlternativo1: clienteDetalle.telefonoAlternativo1 || "",
        mailAlternativo: clienteDetalle.mailAlternativo || "",
        mailAlternativo1: clienteDetalle.mailAlternativo1 || "",
        contactoAlternativo: clienteDetalle.contactoAlternativo || "",
        contactoAlternativo1: clienteDetalle.contactoAlternativo1 || "",
      });
    }
  }, [clienteDetalle, id, idUsuario]);

  const fetchProvincias = async () => {
    try {
      const response = await fetch(
        "https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre"
      );
      const data = await response.json();
      return data.provincias;
    } catch (error) {
      console.error("Error fetching provincias:", error);
    }
  };

  const fetchMunicipios = async (provinciaId) => {
    try {
      const response = await fetch(
        `https://apis.datos.gob.ar/georef/api/municipios?provincia=${provinciaId}&campos=id,nombre&max=100`
      );
      const data = await response.json();
      return data.municipios;
    } catch (error) {
      console.error("Error fetching municipios:", error);
    }
  };

  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    const loadProvincias = async () => {
      const provinciasData = await fetchProvincias();
      setProvincias(provinciasData || []);
    };

    loadProvincias();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "provincia") {
      const provinciaId = provincias.find((p) => p.nombre === value)?.id;
      if (provinciaId) {
        const municipiosData = await fetchMunicipios(provinciaId);
        setMunicipios(municipiosData || []);
        // Solo actualiza el valor del campo `provincia` y resetea `ciudad`
        setFormData({
          ...formData,
          provincia: value,
          ciudad: "",
        });
      } else {
        setMunicipios([]);
        setFormData({
          ...formData,
          provincia: value,
          ciudad: "",
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let clienteData = { ...formData };

    Object.keys(clienteData).forEach((key) => {
      if (clienteData[key] === "") {
        delete clienteData[key];
      }
    });

    const data = { ...clienteData, idUsuario };

    try {
      await ediCliente(data);
      console.log("Cliente creado exitosamente");
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

  return (
    <div className="postVentaContainer1">
      <BackButton />
      <h2
        className="tituloCompo"
        style={{ display: "flex", justifyContent: "center" }}
      >
        Modificar Cliente
      </h2>
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <div className="formClientes">
          <div className="form-group">
            <label htmlFor="CUIT">
              CUIT <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              id="CUIT"
              name="CUIT"
              value={formData.CUIT}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="razonSocial"> Razón Social</label>
            <input
              type="text"
              id="razonSocial"
              name="razonSocial"
              value={formData.razonSocial}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre<span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">
              Apellido<span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="provincia">Provincia</label>
            <Select
              id="provincia"
              name="provincia"
              options={provincias.map((provincia) => ({
                value: provincia.nombre,
                label: provincia.nombre,
              }))}
              value={
                formData.provincia
                  ? { value: formData.provincia, label: formData.provincia }
                  : null
              }
              onChange={(selectedOption) =>
                handleChange({
                  target: { name: "provincia", value: selectedOption.value },
                })
              }
              placeholder="Selecciona una provincia"
              isClearable
            />
          </div>

          <div className="form-group">
            <label htmlFor="ciudad">Ciudad</label>
            <Select
              id="ciudad"
              name="ciudad"
              options={municipios.map((municipio) => ({
                value: municipio.nombre,
                label: municipio.nombre,
              }))}
              value={
                formData.ciudad
                  ? { value: formData.ciudad, label: formData.ciudad }
                  : null
              }
              onChange={(selectedOption) =>
                handleChange({
                  target: { name: "ciudad", value: selectedOption.value },
                })
              }
              placeholder="Selecciona una ciudad"
              isClearable
            />
          </div>
          <div className="form-group">
            <label htmlFor="domicilio">Domicilio</label>
            <input
              type="text"
              id="domicilio"
              name="domicilio"
              value={formData.domicilio}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mail">
              Email<span className="obligatorio">*</span>
            </label>
            <input
              type="email"
              id="mail"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">
              Teléfono<span className="obligatorio">*</span>
            </label>
            <input
              type="number"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={(e) => handleChange(soloNumeros(e))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactoAlternativo">Contacto Alternativo</label>
            <input
              type="contactoAlternativo"
              id="contactoAlternativo"
              name="contactoAlternativo"
              value={formData.contactoAlternativo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mailAlternativo">Email</label>
            <input
              type="email"
              id="mailAlternativo"
              name="mailAlternativo"
              value={formData.mailAlternativo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefonoAlternativo">Teléfono</label>
            <input
              type="number"
              id="telefonoAlternativo"
              name="telefonoAlternativo"
              value={formData.telefonoAlternativo}
              onChange={(e) => handleChange(soloNumeros(e))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactoAlternativo1">Contacto Alternativo</label>
            <input
              type="contactoAlternativo1"
              id="contactoAlternativo1"
              name="contactoAlternativo1"
              value={formData.contactoAlternativo1}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mailAlternativo1">Email</label>
            <input
              type="email"
              id="mailAlternativo1"
              name="mailAlternativo1"
              value={formData.mailAlternativo1}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefonoAlternativo1">Teléfono</label>
            <input
              type="number"
              id="telefonoAlternativo1"
              name="telefonoAlternativo1"
              value={formData.telefonoAlternativo1}
              onChange={(e) => handleChange(soloNumeros(e))}
            />
          </div>
        </div>
        <button type="submit" className="form-submit">
          Modificar datos del cliente
        </button>
      </form>
    </div>
  );
}
