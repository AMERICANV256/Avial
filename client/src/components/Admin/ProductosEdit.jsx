import React, { useState, useEffect } from "react";
import { useProducto } from "../../hooks/useProductos";
import { useParams } from "react-router-dom";
import BackButton from "../../UI/BackButton";
import CreatableSelect from "react-select/creatable";

const Clouddinary = import.meta.env.VITE_CLOUDINARY_URL;

export default function ProductosEdit() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const {
    productoQueryById: { data: productoDetalle, isLoading: isLoadingDetalle },

    productosEditMutation: { mutate: productoEdit },
  } = useProducto(id);

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

  const [producto, setProducto] = useState({
    id: id,
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

  useEffect(() => {
    if (productoDetalle) {
      setProducto({
        id: productoDetalle.id || id,
        familia: productoDetalle.familia || "",
        marca: productoDetalle.marca || "",
        modelo: productoDetalle.modelo || "",
        division: productoDetalle.division || "",
        precioUSD: productoDetalle.precioUSD || 0,
        imagen: productoDetalle.imagen || "",
        imagen1: productoDetalle.imagen1 || "",
        imagen2: productoDetalle.imagen2 || "",
        imagen3: productoDetalle.imagen3 || "",
        cantidadTotal: productoDetalle.cantidadTotal || 0,
        codigo: productoDetalle.codigo || "",
        motor: productoDetalle.motor || "",
        caracteristicasGenerales:
          productoDetalle.caracteristicasGenerales || "",
        motoresdeTraslacionyZapatas:
          productoDetalle.motoresdeTraslacionyZapatas || "",
        sistemaHidraulico: productoDetalle.sistemaHidraulico || "",
        capacidades: productoDetalle.capacidades || "",
        Cabina: productoDetalle.Cabina || "",
        dimensionesGenerales: productoDetalle.dimensionesGenerales || "",
        fichaPDF: productoDetalle.fichaPDF || "",
      });
    }
  }, [productoDetalle, id]);

  const saveProduct = async (e) => {
    e.preventDefault();
    productoEdit(producto);
  };

  return (
    <div className="postVentaContainer1">
      <BackButton />
      <h2
        className="tituloCompo"
        style={{ display: "flex", justifyContent: "center" }}
      >
        Editar Producto
      </h2>{" "}
      <br />
      <form onSubmit={saveProduct}>
        <div className="form-group">
          <label htmlFor="division">División</label>
          <input
            type="text"
            id="division"
            name="division"
            value={producto.division}
            autoComplete="off"
            placeholder="División"
            onChange={(e) =>
              setProducto({ ...producto, division: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="familia">Familia</label>
          <input
            type="text"
            id="familia"
            name="familia"
            value={producto.familia}
            autoComplete="off"
            placeholder="Familia"
            onChange={(e) =>
              setProducto({ ...producto, familia: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="marca">Marca</label>
          <input
            id="marca"
            name="marca"
            type="text"
            value={producto.marca}
            onChange={(e) =>
              setProducto({
                ...producto,
                marca: e.target.value,
              })
            }
            placeholder="Marca"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="modelo">Modelo</label>
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
            Precio USD <span className="obligatorio">*</span>
          </label>
          <div>
            <input
              type="number"
              id="precioUSD"
              name="precioUSD"
              value={producto.precioUSD}
              autoComplete="off"
              placeholder="Precio USD"
              onChange={(e) =>
                setProducto({ ...producto, precioUSD: e.target.value })
              }
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
            Modificar Producto
          </button>
        </div>
      </form>
    </div>
  );
}
