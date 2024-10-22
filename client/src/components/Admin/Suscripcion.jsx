import { useState, useEffect } from "react";
import Spinner from "../../UI/Spinner";
import { useSuscriptores } from "../../hooks/useSuscriptores";
import DataTable from "react-data-table-component";
import BackButton from "../../UI/BackButton";

export default function Suscripcion() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useSuscriptores().suscripcionQuery;

  const [usuarios, setUsuarios] = useState(data);

  useEffect(() => {
    if (!isLoading) {
      setUsuarios(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    filterByEmailAndApellido(search);
  }, [search, data]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const filterByEmailAndApellido = (value) => {
    if (!value) {
      setUsuarios(data);
    } else {
      const arrayCache = data.filter(
        (oper) =>
          oper.email && oper.email.toLowerCase().includes(value.toLowerCase())
      );
      setUsuarios(arrayCache);
    }
  };

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

  const columns = [
    { name: "Email", selector: (row) => row.email, sortable: true },

    {
      name: "Creado",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
  ];

  return (
    <div className="form-container">
      <BackButton />
      <>
        <div>
          <div className="form-group" style={{ maxWidth: "40%" }}>
            <h2 className="tituloCompo">Suscriptores</h2> <br />
            <input
              type="text"
              className="form-input"
              placeholder="Buscar EMAIL"
              onChange={handleOnChange}
              value={search}
              autoComplete="off"
              disabled={!data}
              style={{ height: "2rem" }}
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
