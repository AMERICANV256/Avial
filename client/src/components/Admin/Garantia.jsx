import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useGarantia } from "../../hooks/useGarantia";
import { useUsuario } from "../../hooks/useUsuarios";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Spinner from "../../UI/Spinner";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import GarantiaExcel from "./Excel/GarantiaExcel";
import BackButton from "../../UI/BackButton";

export default function Garantia() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedContactos, setSelectedContactos] = useState(null);

  const { data, isLoading } = useGarantia().GarantiaQuery;

  const { mutate: modificarGarantia } = useGarantia().garantiaEditMutation;

  const [garantia, setGarantias] = useState(data);

  const { data: usuariosADerivar } = useUsuario().usuariosMensajesQuery;

  const userOptions = usuariosADerivar?.allUsers.map((user) => ({
    value: user.id,
    label: `${user.nombre} ${user.apellido} (${user.email})`,
  }));

  useEffect(() => {
    if (data) {
      setGarantias(data);
    }
  }, [data]);

  //-------------------------------- SEARCHBAR --------------------------- //

  useEffect(() => {
    filterByEmailAndEmpresa(search);
  }, [search]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const filterByEmailAndEmpresa = (value) => {
    if (!value) {
      setGarantias(data);
    } else {
      const arrayCache = data?.filter(
        (oper) =>
          oper.empresa.toLowerCase().includes(value.toLowerCase()) ||
          oper.email.toLowerCase().includes(value.toLowerCase())
      );
      setGarantias(arrayCache);
    }
  };

  const columns = [
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Empresa", selector: (row) => row.empresa, sortable: true },
    { name: "Modelo", selector: (row) => row.modelo, sortable: true },
    {
      name: "Falla",
      selector: (row) => row.modelo,
      sortable: true,
    },

    {
      name: "Fecha de Envío",
      selector: (row) => new Date(row.fechaCrea).toLocaleString(),
      sortable: true,
    },
    {
      name: "Ver",
      cell: (row) => (
        <DropdownButton
          id={`dropdown-acciones-${row.id}`}
          variant="secondary"
          size="sm"
          className="acciones-dropdown acciones-dropdown-custom"
        >
          <Dropdown.Item
            as={Link}
            to={`/admin/garantias/garantia/${row.id}`}
            className="dropdown-item dropdown-item-ver"
          >
            Ver Garantía
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

  const handleDerivar = (contactos) => {
    setSelectedContactos(contactos);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (selectedUser && selectedContactos) {
      modificarGarantia({
        idGarantia: selectedContactos.id,
        idUsuario: selectedUser.value,
      });
      setShowModal(false);
    }
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.idUsuario,
      style: {
        backgroundColor: "#e6ffe6",
      },
    },
  ];

  return (
    <div className="form-container">
      <BackButton />
      <div>
        <>
          <div className="form-group" style={{ maxWidth: "60%" }}>
            <h2 className="tituloCompo">Garantía</h2> <br />
            <input
              type="text"
              className="form-input"
              placeholder="Buscar por EMPRESA O EMAIL"
              onChange={handleOnChange}
              value={search}
              autoComplete="off"
              disabled={!data}
            />
          </div>
          <div className="datatable">
            {!showSpinner ? (
              <DataTable
                columns={columns}
                data={garantia}
                pagination
                striped
                responsive
                conditionalRowStyles={conditionalRowStyles}
                noDataComponent={
                  <div className="noData">Aún no hay registros ingresados</div>
                }
              />
            ) : (
              <Spinner loading={isLoading} />
            )}
          </div>
        </>
        <div>
          <GarantiaExcel data={data} />
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
