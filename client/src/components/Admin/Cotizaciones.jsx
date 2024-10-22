import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useCotizaciones } from "../../hooks/useCotizaciones";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Spinner from "../../UI/Spinner";
import CotizacionesExcel from "./Excel/CotizacionesExcel";
import BackButton from "../../UI/BackButton";
import { paginationOptions } from "../../utils/Datatable";

export default function Cotizaciones() {
  const { auth } = useAuth();
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const idUsuario = token;

  const [clicked, setClicked] = useState({ isClicked: false });

  const { mutate: cotizacionState2 } =
    useCotizaciones().cotizacionMutationState2;

  const handleConcretarVenta = async (id) => {
    try {
      const data = { id };

      await cotizacionState2(data);
    } catch (error) {
      console.error("Error al concretar venta:", error);
    }
  };

  const { cotizacionesQueryById, isLoading } = useCotizaciones(idUsuario);
  const [cotizaciones, setCotizaciones] = useState(cotizacionesQueryById.data);

  useEffect(() => {
    if (cotizacionesQueryById.data) {
      setCotizaciones(cotizacionesQueryById.data);
    }
  }, [cotizacionesQueryById.data]);

  useEffect(() => {
    filterByEmailAndEmpresa(search);
  }, [search, cotizacionesQueryById.data]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const filterByEmailAndEmpresa = (value) => {
    if (!value) {
      setCotizaciones(cotizacionesQueryById.data);
    } else {
      const arrayCache = cotizacionesQueryById.data.filter(
        (oper) =>
          (oper.numeroCotizacion &&
            oper.numeroCotizacion
              .toLowerCase()
              .includes(value.toLowerCase())) ||
          (oper.Producto.modelo &&
            oper.Producto.modelo.toLowerCase().includes(value.toLowerCase())) ||
          (oper.Usuario.apellido &&
            oper.Usuario.apellido.toLowerCase().includes(value.toLowerCase()))
      );
      setCotizaciones(arrayCache);
    }
  };

  const columns = [
    {
      name: "Nro Cotización",
      selector: (row) => row.codigoCotizacion,
      sortable: true,
      width: "160px",
    },
    {
      name: "Familia",
      selector: (row) => row.Producto.familia,
      sortable: true,
      width: "160px",
    },
    {
      name: "Marca",
      selector: (row) => row.Producto.marca,
      sortable: true,
      width: "160px",
    },
    {
      name: "Modelo",
      selector: (row) => row.Producto.modelo,
      sortable: true,
      width: "160px",
    },

    {
      name: "Fecha de Cotización",
      selector: (row) => new Date(row.fechaDeCreacion).toLocaleDateString(),
      sortable: true,
      width: "160px",
    },
    {
      name: "Vendedor",
      selector: (row) => `${row.Usuario.nombre} ${row.Usuario.apellido}`,
      sortable: true,
      width: "160px",
    },
    {
      name: "Cliente",
      selector: (row) => `${row.Cliente.nombre} ${row.Cliente.apellido}`,
      sortable: true,
      width: "160px",
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
            to={`/admin/cotizaciones/ver/${row.id}`}
            className="dropdown-item dropdown-item-ver"
          >
            Ver Cotización
          </Dropdown.Item>
          <Dropdown.Item
            as={Link}
            to={`/admin/cotizaciones/modificar/${row.id}`}
            className="dropdown-item dropdown-item-modificar"
          >
            Modificar
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
      <div>
        <div className="form-group" style={{ maxWidth: "40%" }}>
          <h2 className="tituloCompo">Cotizaciones</h2> <br />
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por Nro, VENDEDOR O MODELO"
            onChange={handleOnChange}
            value={search}
            autoComplete="off"
            disabled={!cotizacionesQueryById.data}
          />
        </div>
        {!showSpinner ? (
          <DataTable
            className="datatable-container"
            paginationComponentOptions={paginationOptions}
            columns={columns}
            data={cotizaciones}
            pagination
            striped
            noDataComponent={
              <div className="noData">Aún no hay registros ingresados</div>
            }
          />
        ) : (
          <Spinner loading={isLoading} />
        )}
        <div>
          <CotizacionesExcel data={cotizacionesQueryById.data} />
        </div>
      </div>
    </div>
  );
}
