import React, { useState } from "react";
import { useOfertasNovedades } from "../../hooks/useOfertasNovedades";
import BackButton from "../../UI/BackButton";
import Spinner from "../../UI/Spinner";

const Clouddinary = import.meta.env.VITE_CLOUDINARY_URL;

export default function OfertasNovedades() {
  const [oferta, setOferta] = useState({
    novedades: "",
    foto: "",
  });

  const { mutate: crearOferta } = useOfertasNovedades().ofertaNovedadMutation;
  const { mutate: eliminarOferta } =
    useOfertasNovedades().ofertaNovedadDeleteMutation;

  const { data } = useOfertasNovedades().ofertaNovedadQuery;

  const [loading, setLoading] = useState(false);

  const uploadImage = async (e) => {
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

    setOferta({ ...oferta, foto: uploadedImages[0] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOferta((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const EliminarOferta = (id) => {
    eliminarOferta({ id: id });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!oferta.novedades) {
      alert("El campo novedades es obligatorio");
      return;
    }

    crearOferta(oferta);

    setOferta({
      novedades: "",
      foto: "",
    });
  };

  return (
    <div className="form-container2">
      <BackButton />
      <br />
      <div className="novedadtitle">
        <h2>Crear Novedad</h2>
      </div>
      <br />
      <div className="containerNovedades">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="novedades">Novedades:</label>
            <textarea
              type="text"
              id="novedades"
              name="novedades"
              value={oferta.novedades}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="foto">Foto:</label>
            <input
              type="file"
              id="foto"
              onChange={uploadImage}
              disabled={loading}
            />
            {loading && <Spinner />}
            {oferta.foto && (
              <img
                src={oferta.foto}
                alt="Imagen cargada"
                style={{ width: "200px", marginTop: "10px" }}
              />
            )}
          </div>
          <button type="submit" className="form-submit" disabled={loading}>
            Crear
          </button>
        </form>
      </div>
      <div className="ofertas-list">
        {data && data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className="oferta-item">
              <button
                className="delete-button"
                onClick={() => EliminarOferta(item.id)}
              >
                ×
              </button>
              <img src={item.foto} alt={`Oferta ${item.id}`} />
              <br />
              <p>
                {" "}
                <strong>{item.novedades}</strong>
              </p>
            </div>
          ))
        ) : (
          <p>No hay ofertas o novedades disponibles.</p>
        )}
      </div>
    </div>
  );
}
