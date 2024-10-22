// import React, { useEffect, useState } from "react";
// import { useMensajes } from "../../hooks/useMensajes";
// import useAuth from "../../hooks/useAuth";
// import { Link } from "react-router-dom";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";
// import DataTable from "react-data-table-component";
// import Spinner from "../../UI/Spinner";
// import BackButton from "../../UI/BackButton";

// export default function MensajesEnviados() {
//   const { auth } = useAuth();
//   const token = localStorage.getItem("token");
//   const idUsuario = token;

//   const { data: mensajes, isLoading } =
//     useMensajes(idUsuario).MensajesEnviadosQuery;

//   const [search, setSearch] = useState("");
//   const [enviados, setEnviados] = useState([]);

//   //-------------------------------- SEARCHBAR --------------------------- //

//   useEffect(() => {
//     setEnviados(mensajes);
//   }, [mensajes]);

//   useEffect(() => {
//     filterByEmailAndEmpresa(search);
//   }, [search, mensajes]);

//   const handleOnChange = (e) => {
//     setSearch(e.target.value);
//   };

//   const filterByEmailAndEmpresa = (value) => {
//     if (!value) {
//       setEnviados(mensajes);
//     } else {
//       const arrayCache = mensajes?.filter((oper) => {
//         const email = oper.Usuario?.email?.toLowerCase() || "";
//         return email.includes(value.toLowerCase());
//       });
//       setEnviados(arrayCache);
//     }
//   };

//   const columns = [
//     {
//       name: "Destinatario",
//       selector: (row) => row.Usuario.email,
//       sortable: true,
//     },
//     { name: "Mensaje", selector: (row) => row.Mensaje, sortable: true },
//     {
//       name: "Fecha de Envío",
//       selector: (row) => new Date(row.fechaDeEnvio).toLocaleDateString(),
//       sortable: true,
//     },

//     {
//       name: "Ver",
//       cell: (row) => (
//         <DropdownButton
//           id={`dropdown-acciones-${row.id}`}
//           variant="secondary"
//           size="sm"
//           className="acciones-dropdown acciones-dropdown-custom"
//         >
//           <Dropdown.Item
//             as={Link}
//             to={`/admin/mensajes/enviados/${row.id}`}
//             className="dropdown-item dropdown-item-ver"
//           >
//             Ver Mensaje
//           </Dropdown.Item>
//         </DropdownButton>
//       ),
//     },
//   ];

//   //---------------------------------SPINNER ------------------------------------//

//   const [showSpinner, setShowSpinner] = useState(true);

//   useEffect(() => {
//     setShowSpinner(true);

//     const timer = setTimeout(() => {
//       setShowSpinner(false);
//     }, 1500);

//     return () => clearTimeout(timer);
//   }, [isLoading]);

//   //---------------------------------FIN SPINNER ------------------------------------//

//   return (
//     <div className="form-container">
//       <BackButton />
//       <div>
//         <div className="form-group" style={{ maxWidth: "60%" }}>
//           <h2 className="tituloCompo">Mensajes Enviados</h2> <br />
//           <input
//             type="text"
//             className="form-input"
//             placeholder="Buscar por EMAIL"
//             onChange={handleOnChange}
//             value={search}
//             autoComplete="off"
//             disabled={!mensajes}
//           />
//         </div>
//         {!showSpinner ? (
//           <DataTable
//             columns={columns}
//             data={enviados}
//             pagination
//             striped
//             noDataComponent={
//               <div className="noData">Aún no hay registros ingresados</div>
//             }
//           />
//         ) : (
//           <Spinner loading={isLoading} />
//         )}
//       </div>
//     </div>
//   );
// }
