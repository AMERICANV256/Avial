import { useEffect, useState } from "react";
import { useContactoProducto } from "../../hooks/useContactoProducto";
import DataTable from "react-data-table-component";
import Spinner from "../../UI/Spinner";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Link } from "react-router-dom";
import { useUsuario } from "../../hooks/useUsuarios";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ContactoProductoExcel from "./Excel/ContactoProductoExcel";
import BackButton from "../../UI/BackButton";

export default function ContactoProducto() {
  const { data, isLoading } = useContactoProducto().contactoProductoQuery;
  const { mutate: modificarContactoProducto } =
    useContactoProducto().contactoProductoEditMutation;
  const [search, setSearch] = useState("");
  const [contactoProducto, setContactoProducto] = useState(data);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedContactoProducto, setSelectedContactoProducto] =
    useState(null);

  const { data: usuariosADerivar } = useUsuario().usuariosMensajesQuery;

  const userOptions = usuariosADerivar?.allUsers.map((user) => ({
    value: user.id,
    label: `${user.nombre} ${user.apellido} (${user.email})`,
  }));

  useEffect(() => {
    if (data) {
      setContactoProducto(data);
    }
  }, [data]);

  //-------------------------------- SEARCHBAR --------------------------- //

  useEffect(() => {
    filterByEmailAndNombreCompleto(search);
  }, [search]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const filterByEmailAndNombreCompleto = (value) => {
    if (!value) {
      setContactoProducto(data);
    } else {
      const arrayCache = data?.filter(
        (oper) =>
          oper.razonSocial.toLowerCase().includes(value.toLowerCase()) ||
          oper.email.toLowerCase().includes(value.toLowerCase())
      );
      setContactoProducto(arrayCache);
    }
  };

  //-------------------------------- FIN SEARCHBAR --------------------------- //

  const handleDerivar = (contactoProducto) => {
    setSelectedContactoProducto(contactoProducto);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (selectedUser && selectedContactoProducto) {
      modificarContactoProducto({
        idContactoProducto: selectedContactoProducto.id,
        idUsuario: selectedUser.value,
      });
      setShowModal(false);
    }
  };

  const columns = [
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "Razón Social",
      selector: (row) => row.razonSocial,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Apellido",
      selector: (row) => row.apellido,
      sortable: true,
    },
    { name: "Marca", selector: (row) => row.Producto.marca, sortable: true },
    { name: "Modelo", selector: (row) => row.Producto.modelo, sortable: true },
    {
      name: "Fecha de Registro",
      selector: (row) => new Date(row.fechaDeRegistro).toLocaleString(),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <DropdownButton
          id={`dropdown-acciones-${row.id}`}
          variant="secondary"
          size="sm"
          className="acciones-dropdown acciones-dropdown-custom"
        >
          <Dropdown.Item
            as={Link}
            to={`/admin/ContacoProducto/ver/${row.id}`}
            className="dropdown-item dropdown-item-ver"
          >
            Detalle
          </Dropdown.Item>
          {!row.idUsuario && (
            <Dropdown.Item
              className="dropdown-item dropdown-item-modificar"
              onClick={() => handleDerivar(row)}
            >
              Derivar
            </Dropdown.Item>
          )}
        </DropdownButton>
      ),
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.idUsuario,
      style: {
        backgroundColor: "#e6ffe6",
      },
    },
  ];

  //---------------------------------SPINNER ------------------------------------//

  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    setShowSpinner(true);

    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isLoading]);

  //---------------------------------FIN SPINNER ------------------------------------//

  return (
    <div className="form-container">
      <BackButton />
      <div>
        <>
          <div className="form-group" style={{ maxWidth: "60%" }}>
            <h2 className="tituloCompo">Contacto por Producto</h2> <br />
            <input
              type="text"
              className="form-input"
              placeholder="Buscar por RAZÓN SOCIAL O EMAIL"
              onChange={handleOnChange}
              value={search}
              autoComplete="off"
              disabled={!data}
            />
          </div>
          {!showSpinner ? (
            <DataTable
              columns={columns}
              data={contactoProducto}
              pagination
              striped
              noDataComponent={
                <div className="noData">Aún no hay registros ingresados</div>
              }
              conditionalRowStyles={conditionalRowStyles}
            />
          ) : (
            <Spinner loading={isLoading} />
          )}
        </>
        <div>
          <ContactoProductoExcel data={data} />
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center", width: "100%" }}>
            Derivar Mensaje
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            options={userOptions}
            onChange={(option) => setSelectedUser(option)}
            placeholder="Seleccionar usuario"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{
              backgroundColor: "#333",
              color: "#FFD700",
              borderColor: "#333",
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#FFD700",
              color: "#333",
              borderColor: "#FFD700",
            }}
          >
            Derivar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
