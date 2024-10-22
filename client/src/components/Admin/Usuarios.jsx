import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import useAuth from "../../hooks/useAuth";
import { useUsuario } from "../../hooks/useUsuarios";
import Spinner from "../../UI/Spinner";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Link } from "react-router-dom";
import BackButton from "../../UI/BackButton";
import { paginationOptions } from "../../utils/Datatable";

export default function Usuarios() {
  const [search, setSearch] = useState("");
  const { auth } = useAuth();
  const { data, isLoading } = useUsuario().usuariosQuery;

  const allUsers = data?.allUsers || [];

  const [usuarios, setUsuarios] = useState(allUsers);

  useEffect(() => {
    if (!isLoading) {
      setUsuarios(allUsers);
    }
  }, [allUsers, isLoading]);

  useEffect(() => {
    filterByEmailAndApellido(search);
  }, [search, allUsers]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const filterByEmailAndApellido = (value) => {
    if (!value) {
      setUsuarios(allUsers);
    } else {
      const arrayCache = allUsers.filter(
        (oper) =>
          (oper.apellido &&
            oper.apellido.toLowerCase().includes(value.toLowerCase())) ||
          (oper.email && oper.email.toLowerCase().includes(value.toLowerCase()))
      );
      setUsuarios(arrayCache);
    }
  };

  const columns = [
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Apellido", selector: (row) => row.apellido, sortable: true },
    {
      name: "Dirección",
      selector: (row) => row.direccion || "N/A",
      sortable: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.telefono || "N/A",
      sortable: true,
    },
    {
      name: "Creado",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
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
            to={`/admin/usuarios/${row.id}`}
            className="dropdown-item dropdown-item-ver"
          >
            Ver Detalle
          </Dropdown.Item>
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

  return (
    <div className="postVentaContainer">
      <BackButton />
      <>
        <div>
          <div className="form-group" style={{ maxWidth: "40%" }}>
            <h2 className="tituloCompo">Usuarios</h2> <br />
            <input
              type="text"
              className="form-input"
              placeholder="Buscar por APELLIDO O EMAIL"
              onChange={handleOnChange}
              value={search}
              autoComplete="off"
              disabled={!data}
            />
          </div>
          <div className="datatable-container">
            {!showSpinner ? (
              <DataTable
                columns={columns}
                data={usuarios}
                pagination
                striped
                responsive
                paginationComponentOptions={paginationOptions}
                noDataComponent={
                  <div className="noData">Aún no hay registros ingresados</div>
                }
              />
            ) : (
              <Spinner loading={isLoading} />
            )}
          </div>
        </div>
      </>
    </div>
  );
}
