import React, { useState } from "react";
import { useClientes } from "../../../hooks/useClientes";
import useAuth from "../../../hooks/useAuth";
import BackButton from "../../../UI/BackButton";
import Spinner from "../../../UI/Spinner";
import { useMails } from "../../../hooks/useMailsMasivos";
import Spinner2 from "../../../UI/Spinner2";

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
    setPassword("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ingresa tu contraseña</h2>
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            style={{
              borderRadius: "10px",
              padding: "10px",
              width: "60%",
              color: "grey",
            }}
          />
          <br />
          <br />
          <br />

          <div className="modal-buttons">
            <button
              style={{
                backgroundColor: "#ffcc00",
                color: "#000",
                padding: "10px 20px",
                fontSize: "16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              type="submit"
            >
              Enviar
            </button>
            <button
              style={{
                backgroundColor: "#ffcc00",
                color: "#000",
                padding: "10px 20px",
                fontSize: "16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Clouddinary = import.meta.env.VITE_CLOUDINARY_URL;

export default function MailsMasivos() {
  const { mutate: CrearEmails } = useMails().mailsMutation;
  const { auth } = useAuth();
  const emailEmisor = auth?.email;

  //CLOUDDINARY//

  const [images, setImages] = useState([]);
  const [producto, setProducto] = useState();
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
    setProducto({ ...producto, pdf: pdfData.secure_url });
  };

  const token = localStorage.getItem("token");
  const idUsuario = token;

  const { data: clientesEmail, isLoading: clientesLoading } =
    useClientes(idUsuario).clientesEmailsQuery;

  // Estado local para el estado de envío
  const [enviando, setEnviando] = useState(false);

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [cuerpoMensaje, setCuerpoMensaje] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (clientesLoading) return <Spinner />;

  const handleEmailSelection = (email) => {
    setSelectedEmails((prevEmails) =>
      prevEmails.includes(email)
        ? prevEmails.filter((e) => e !== email)
        : [...prevEmails, email]
    );
  };

  const handleEnviarEmails = (e) => {
    e.preventDefault();
    if (selectedEmails.length === 0) {
      alert("Debes seleccionar al menos un email para enviar el mensaje.");
      return;
    }
    if (!cuerpoMensaje) {
      alert("Por favor, ingresa el cuerpo del mensaje.");
      return;
    }

    setIsModalOpen(true);
  };

  const handlePasswordSubmit = (password) => {
    const emailData = {
      emailEmisor,
      emailsReceptores: selectedEmails,
      cuerpoMensaje,
      imagen: producto.imagen,
      imagen1: producto.imagen1,
      pdf: producto.pdf,
      password,
    };

    setEnviando(true);

    CrearEmails(emailData, {
      onSuccess: () => {
        setSelectedEmails([]);
        setCuerpoMensaje("");

        setEnviando(false);
      },
      onError: () => {
        setEnviando(false);
      },
    });
    setIsModalOpen(false);
  };

  const handleSelectAll = () => {
    const allEmails = clientesEmail
      .flatMap((cliente) => [
        cliente.mail,
        cliente.mailAlternativo,
        cliente.mailAlternativo1,
      ])
      .filter(Boolean);

    setSelectedEmails(allEmails);
  };

  // Función para deseleccionar todos los emails
  const handleDeselectAll = () => {
    setSelectedEmails([]);
  };

  return (
    <div className="postVentaContainer">
      <BackButton />
      <h2 className="tituloCompo">Notificar vía Email</h2>
      <hr />
      <br />
      <form onSubmit={handleEnviarEmails}>
        <div className="select-buttons">
          <button type="button" onClick={handleSelectAll}>
            Seleccionar Todos
          </button>
          <button type="button" onClick={handleDeselectAll}>
            Deseleccionar Todos
          </button>
        </div>
        <br />
        <div className="clientes-list">
          {clientesEmail?.map((cliente) => {
            const emails = [
              cliente.mail,
              cliente.mailAlternativo,
              cliente.mailAlternativo1,
            ].filter(Boolean);

            return (
              <div key={cliente.nombre} className="cliente">
                <h4>
                  {cliente.apellido}, {cliente.nombre}
                </h4>
                {emails.map((email) => (
                  <div key={email} className="email-item">
                    <input
                      type="checkbox"
                      value={email}
                      onChange={() => handleEmailSelection(email)}
                      checked={selectedEmails.includes(email)}
                    />
                    <label>{email}</label>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <hr />
        <div className="email-body">
          <label style={{ color: "black" }} htmlFor="cuerpoMensaje">
            Mensaje:
          </label>
          <textarea
            id="cuerpoMensaje"
            value={cuerpoMensaje}
            onChange={(e) => setCuerpoMensaje(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="imagen">Imagen 1</label>
          <input
            type="file"
            id="imagen"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              uploadImage(e, 0);
              setProducto({
                ...producto,
                previewImage: URL.createObjectURL(e.target.files[0]),
              });
            }}
          />
          {producto?.previewImage && (
            <div className="image-preview">
              <img
                src={producto.previewImage}
                alt="Previsualización Imagen 1"
                style={{ width: "200px" }}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="imagen1">Imagen 2</label>
          <input
            type="file"
            id="imagen1"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              uploadImage(e, 1);
              setProducto({
                ...producto,
                previewImage1: URL.createObjectURL(e.target.files[0]),
              });
            }}
          />
          {producto?.previewImage1 && (
            <div className="image-preview">
              <img
                src={producto.previewImage1}
                alt="Previsualización Imagen 2"
                style={{ width: "200px" }}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="fichaPDF">PDF</label>
          <input
            type="file"
            id="fichaPDF"
            accept="application/pdf"
            onChange={(e) => {
              uploadPDF(e);
              setProducto({
                ...producto,
                previewPDF: URL.createObjectURL(e.target.files[0]),
              });
            }}
          />
          {producto?.previewPDF && (
            <div className="pdf-preview">
              <a
                href={producto.previewPDF}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Previsualización PDF
              </a>
            </div>
          )}
        </div>

        <button className="form-submit" type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar Email"}
        </button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
}

//enviando apellido por email //
