import React, { useState } from "react";
import Swal from "sweetalert2";
import { useProducto } from "../../hooks/useProductos";
import { useNavigate } from "react-router-dom";
import BackButton from "../../UI/BackButton";
import CreatableSelect from "react-select/creatable";

const Clouddinary = import.meta.env.VITE_CLOUDINARY_URL;

export default function FormProduct() {
  const navigate = useNavigate();

  //CLOUDDINARY//

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (e, imageNumber) => {
    const files = e.target.files;

    setLoading(true);

    const uploadedImages = [];

    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Images");

      const res = await fetch(Clouddinary, {
        method: "POST",
        body: data,
      });

      const imageData = await res.json();
      uploadedImages.push(imageData.secure_url);
    }

    setLoading(false);
    switch (imageNumber) {
      case 0:
        setProducto({ ...producto, imagen: uploadedImages[0] });
        break;
      case 1:
        setProducto({ ...producto, imagen1: uploadedImages[0] });
        break;
      case 2:
        setProducto({ ...producto, imagen2: uploadedImages[0] });
        break;
      case 3:
        setProducto({ ...producto, imagen3: uploadedImages[0] });
        break;

      default:
        break;
    }
  };

  const uploadPDF = async (e) => {
    const file = e.target.files[0];

    setLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Images");

    const res = await fetch(Clouddinary, {
      method: "POST",
      body: data,
    });

    const pdfData = await res.json();
    setLoading(false);
    setProducto({ ...producto, fichaPDF: pdfData.secure_url });
  };

  //CLOUDDINARY//
  const [selectedFamilia, setSelectedFamilia] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const { data: productos } = useProducto().productosParaCotizarQuery;
  const { data: marcas } = useProducto().productosMarcasQuery;
  const { data: divisiones } = useProducto().productosDivisionesQuery;
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  const handleChangeEmpresa = (selectedOption) => {
    setSelectedEmpresa(selectedOption);
    setProducto({ ...producto, empresa: selectedOption.value });
  };

  const getUniqueFamilias = (productos) => {
    const familiasSet = new Set(productos?.map((producto) => producto.familia));
    return Array.from(familiasSet).map((familia) => ({
      value: familia,
      label: familia,
    }));
  };

  const opcionesFamilias = getUniqueFamilias(productos);

  const opcionesConNuevaFamilia = [
    ...opcionesFamilias,
    // { value: "nueva", label: "Agregar nueva" },
  ];

  const handleChangeFamilia = (selectedOption) => {
    if (selectedOption.value === "nueva") {
      const nuevaFamilia = prompt("Ingrese la nueva Categoría:");
      if (nuevaFamilia) {
        const newFamiliaOption = { value: nuevaFamilia, label: nuevaFamilia };

        // Actualiza las opciones y selecciona la nueva familia
        setSelectedFamilia(newFamiliaOption);
        setProducto({ ...producto, familia: nuevaFamilia });
      }
    } else {
      setSelectedFamilia(selectedOption);
      setProducto({ ...producto, familia: selectedOption.value });
    }
  };

  const opcionesDivisiones =
    divisiones?.map((division) => ({
      value: division,
      label: division,
    })) || [];

  const opcionesConNuevaDivision = [
    ...opcionesDivisiones,
    // { value: "nueva", label: "Agregar nueva" },
  ];

  const handleChangeDivision = (selectedOption) => {
    if (selectedOption.value === "nueva") {
      const nuevaDivision = prompt("Ingrese la nueva División:");
      if (nuevaDivision) {
        const newDivisionOption = {
          value: nuevaDivision,
          label: nuevaDivision,
        };
        setSelectedDivision(newDivisionOption);
        setProducto({ ...producto, division: nuevaDivision });
      }
    } else {
      setSelectedDivision(selectedOption);
      setProducto({ ...producto, division: selectedOption.value });
    }
  };

  const opcionesMarcas =
    marcas?.map((marca) => ({
      value: marca,
      label: marca,
    })) || [];

  const opcionesConNuevaMarca = [
    ...opcionesMarcas,
    // { value: "nueva", label: "Agregar nueva" },
  ];

  const handleChangeMarca = (selectedOption) => {
    if (selectedOption.value === "nueva") {
      const nuevaMarca = prompt("Ingrese la nueva Marca:");
      if (nuevaMarca) {
        const newMarcaOption = { value: nuevaMarca, label: nuevaMarca };
        setSelectedMarca(newMarcaOption);
        setProducto({ ...producto, marca: nuevaMarca });
      }
    } else {
      setSelectedMarca(selectedOption);
      setProducto({ ...producto, marca: selectedOption.value });
    }
  };

  const handlePrecioChange = (e) => {
    const value = e.target.value;

    const cleanValue = value.replace(/[^0-9]/g, "");

    setProducto({ ...producto, precioUSD: cleanValue });
  };

  const formatPrecio = (precio) => {
    return precio ? new Intl.NumberFormat().format(precio) : "";
  };

  const [producto, setProducto] = useState({
    familia: "",
    marca: "",
    modelo: "",
    division: "",
    precioUSD: 0,
    imagen: "",
    imagen1: "",
    imagen2: "",
    imagen3: "",
    cantidadTotal: 0,
    codigo: "",
    motor: "",
    caracteristicasGenerales: "",
    motoresdeTraslacionyZapatas: "",
    sistemaHidraulico: "",
    capacidades: "",
    Cabina: "",
    dimensionesGenerales: "",
    fichaPDF: "",
  });

  const saveProduct = async (e) => {
    e.preventDefault();

    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}productos/create`,
        {
          method: "POST",
          body: JSON.stringify(producto),
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      // Verificar si el status es 401 (sesión expirada)
      if (request.status === 401) {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Tu sesión ha expirado",
          showConfirmButton: false,
          timer: 2000,
          background: "#ffffff",
          iconColor: "#ffc107",
          customClass: {
            title: "text-dark",
          },
        }).then(() => {
          navigate("/"); // Redirige después de que se cierre el modal
        });
        return; // Detener la ejecución si la sesión ha expirado
      }

      const data = await request.json();

      if (request.ok) {
        console.log("Producto creado:", data);

        Swal.fire({
          position: "center",
          icon: "info",
          title: "El Producto ha sido creado corréctamente",
          showConfirmButton: false,
          timer: 2000,
          background: "#ffffff",
          iconColor: "#ffc107",
          customClass: {
            title: "text-dark",
          },
        });

        setProducto({
          familia: "",
          marca: "",
          modelo: "",
          division: "",
          precioUSD: 0,
          imagen: "",
          imagen1: "",
          imagen2: "",
          imagen3: "",
          cantidadTotal: 0,
          codigo: "",
          motor: "",
          caracteristicasGenerales: "",
          motoresdeTraslacionyZapatas: "",
          sistemaHidraulico: "",
          capacidades: "",
          Cabina: "",
          dimensionesGenerales: "",
          fichaPDF: "",
        });
      } else {
        throw new Error("Error al crear el producto.");
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);

      Swal.fire({
        position: "center",
        icon: "error",
        title: "El producto no pudo crearse. Intente más tarde",
        showConfirmButton: false,
        timer: 2000,
        background: "#ffffff",
        iconColor: "#ffc107",
        customClass: {
          title: "text-dark",
        },
      });
    }
  };

  return (
    <div className="postVentaContainer1">
      <BackButton />
      <h2
        className="tituloCompo"
        style={{ display: "flex", justifyContent: "center" }}
      >
        Cargar Producto
      </h2>{" "}
      <br />
      <form onSubmit={saveProduct}>
        <div className="form-group">
          <div className="form-group">
            <label htmlFor="division">
              División <span className="obligatorio">*</span>
            </label>
            <CreatableSelect
              id="division"
              name="division"
              type="text"
              options={opcionesConNuevaDivision}
              value={selectedDivision}
              onChange={handleChangeDivision}
              placeholder="Selecciona o agrega una nueva división"
              isClearable
              formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
            />
          </div>
          <label htmlFor="familia">
            Familia <span className="obligatorio">*</span>
          </label>
          <CreatableSelect
            id="familia"
            name="familia"
            options={opcionesConNuevaFamilia}
            value={selectedFamilia}
            onChange={handleChangeFamilia}
            placeholder="Selecciona o agrega una nueva categoría"
            isClearable
            required
            formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="marca">
            Marca <span className="obligatorio">*</span>
          </label>

          <CreatableSelect
            id="marca"
            name="marca"
            type="text"
            options={opcionesConNuevaMarca}
            value={selectedMarca}
            onChange={handleChangeMarca}
            placeholder="Selecciona o agrega una nueva marca"
            required
            formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="modelo">
            Modelo<span className="obligatorio">*</span>
          </label>
          <div>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={producto.modelo}
              autoComplete="off"
              placeholder="Modelo"
              onChange={(e) =>
                setProducto({ ...producto, modelo: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="precio">
            Precio U$D <span className="obligatorio">*</span>
          </label>
          <div>
            <input
              type="text"
              id="precioUSD"
              name="precioUSD"
              value={formatPrecio(producto.precioUSD)}
              autoComplete="off"
              placeholder="Precio USD"
              onChange={handlePrecioChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="imagen">Imagen</label>
          <input
            type="file"
            id="imagen"
            name="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => uploadImage(e, 0)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="imagen">Imagen 1</label>
          <input
            type="file"
            id="imagen1"
            name="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => uploadImage(e, 1)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="imagen">Imagen 2</label>
          <input
            type="file"
            id="imagen2"
            name="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => uploadImage(e, 2)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="imagen">Imagen 3</label>
          <input
            type="file"
            id="imagen3"
            name="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => uploadImage(e, 3)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fichaPDF">Ficha PDF</label>
          <input
            id="fichaPDF"
            name="fichaPDF"
            type="file"
            accept="application/pdf"
            onChange={uploadPDF}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cantidadTotal">Cantidad Total</label>
          <div>
            <input
              type="text"
              id="cantidadTotal"
              name="cantidadTotal"
              value={producto.cantidadTotal || ""}
              autoComplete="off"
              placeholder="Cantidad Total"
              onChange={(e) =>
                setProducto({ ...producto, cantidadTotal: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="codigo">Código</label>
          <div>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={producto.codigo || ""}
              autoComplete="off"
              placeholder="Código"
              onChange={(e) =>
                setProducto({ ...producto, codigo: e.target.value })
              }
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="caracteristicasGenerales">
            Características Generales
          </label>
          <div>
            <textarea
              id="caracteristicasGenerales"
              name="caracteristicasGenerales"
              value={producto.caracteristicasGenerales || ""}
              autoComplete="off"
              placeholder="Caracteristicas Generales"
              onChange={(e) =>
                setProducto({
                  ...producto,
                  caracteristicasGenerales: e.target.value,
                })
              }
              style={{ width: "100%", height: "150px", padding: "8px" }}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="motoresDeTraslacionYZapatas">
            Motores de Traslación y Zapatas
          </label>
          <div>
            <textarea
              id="motoresDeTraslacionYZapatas"
              name="motoresDeTraslacionYZapatas"
              value={producto.motoresdeTraslacionyZapatas || ""}
              autoComplete="off"
              placeholder="Motores de Traslación y Zapatas"
              onChange={(e) =>
                setProducto({
                  ...producto,
                  motoresdeTraslacionyZapatas: e.target.value,
                })
              }
              style={{ width: "100%", height: "150px", padding: "8px" }}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="sistemaHidraulico">Sistema Hidráulico</label>
          <div>
            <textarea
              id="sistemaHidraulico"
              name="sistemaHidraulico"
              value={producto.sistemaHidraulico || ""}
              autoComplete="off"
              placeholder="Sistema Hidráulico"
              onChange={(e) =>
                setProducto({
                  ...producto,
                  sistemaHidraulico: e.target.value,
                })
              }
              style={{ width: "100%", height: "150px", padding: "8px" }}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="motor">Motor</label>
          <div>
            <textarea
              id="motor"
              name="motor"
              value={producto.motor || ""}
              autoComplete="off"
              placeholder="Motor"
              onChange={(e) =>
                setProducto({
                  ...producto,
                  motor: e.target.value,
                })
              }
              style={{ width: "100%", height: "150px", padding: "8px" }}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="capacidades">Capacidades</label>
          <div>
            <textarea
              id="capacidades"
              name="capacidades"
              value={producto.capacidades || ""}
              autoComplete="off"
              placeholder="Capacidades"
              onChange={(e) =>
                setProducto({
                  ...producto,
                  capacidades: e.target.value,
                })
              }
              style={{ width: "100%", height: "150px", padding: "8px" }}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="cabina">Cabina</label>
          <div>
            <textarea
              id="Cabina"
              name="Cabina"
              value={producto.Cabina || ""}
              autoComplete="off"
              placeholder="Cabina"
              onChange={(e) =>
                setProducto({
                  ...producto,
                  Cabina: e.target.value,
                })
              }
              style={{ width: "100%", height: "150px", padding: "8px" }}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="dimensionesGenerales">Dimensiones Generales</label>
          <div>
            <textarea
              id="dimensionesGenerales"
              name="dimensionesGenerales"
              value={producto.dimensionesGenerales || ""}
              autoComplete="off"
              placeholder="Dimensiones Generales"
              onChange={(e) =>
                setProducto({
                  ...producto,
                  dimensionesGenerales: e.target.value,
                })
              }
              style={{ width: "100%", height: "150px", padding: "8px" }}
            />
          </div>
        </div>

        <div className="agregarProducto">
          <button className="form-submit" type="submit">
            Agregar Producto
          </button>
        </div>
      </form>
    </div>
  );
}
