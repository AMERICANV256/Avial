import { Font, StyleSheet } from "@react-pdf/renderer";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});

export const styles = StyleSheet.create({
  page: {
    padding: 30,
    width: "80%",
    border: "1px solid #dcdcdc",
    borderRadius: 5,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
    position: "relative",
    textAlign: "left",
  },
  imagenesPDF: {
    display: "flex",
    flexDirection: "row",
  },
  sino: {
    width: "30%",
    marginRight: 50,
    marginTop: -15,
  },
  american: {
    width: 220,
    height: 40,
  },
  SINOMACH: {
    textAlign: "center",
    marginBottom: 20,
  },
  SINOMACHtitle: {
    fontWeight: "bold",
    fontSize: "18px",
  },
  distribuidor: {
    fontSize: "8px",
    textAlign: "left",
  },
  hr: {
    borderBottom: "0.2px solid black",
  },

  fechaformateada: {
    textAlign: "left",
    fontSize: "10px",
  },
  razonSOCIAL: {
    marginBottom: 15,
  },
  datosCliente: {
    fontSize: "12px",
    fontWeight: "ultrabold",
  },
  avg: { textAlign: "right", fontSize: "10px" },
  consideracion: {
    fontSize: 12,
    marginVertical: 10,
    marginTop: 30,
  },

  opcion: {
    fontSize: 10,
    marginVertical: 10,
    textDecoration: "underline",
  },
  sinomachh: {
    fontWeight: "bold",
    color: "#000000",
  },
  cotizacionItem: {
    marginBottom: 15,
    border: "0.3px solid black",
    padding: "15px",
    textAlign: "center",
    width: "98%",
    fontSize: "14px",
  },
  precioUnitario: {
    fontWeight: "bold",
    marginTop: "15px",
    fontSize: "14px",
  },
  cotizacion: {
    fontWeight: "bold",
    marginTop: 15,
    fontSize: "12px",
    marginBottom: 15,
  },

  cotizacionText: {
    fontWeight: "bold",

    fontSize: "12px",
  },

  dolares: {
    fontSize: "9px",
  },
  condicionesgenerales: {
    marginTop: 20,
    padding: 10,
    border: "1px solid black",
  },
  caractcotizar: {
    marginTop: 10,
  },
  caracgeneralescontainer: { marginTop: 5 },
  caracgenerales: {
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "20px",
    textDecoration: "underline",
    textAlign: "center",
  },
  especificaciones: {
    marginLeft: 40,
    marginVertical: 5,
    paddingBottom: 0,
  },

  cursiva: {
    fontStyle: "italic",
  },
  listItem: {
    marginBottom: 5,
    fontSize: "11px",
  },

  especificacionesPrincipales: {
    fontSize: "12px",
    textAlign: "left",
    textDecoration: "underline",
    marginTop: 10,
    marginBottom: 10,
  },
  footerDetail: {
    position: "absolute",
    bottom: 20,
    left: 0,
    width: "100%",
    textAlign: "center",
    fontSize: 8,
    paddingLeft: 60,
    color: "gray",
  },

  watermark: {
    position: "absolute",
    top: "50%",
    left: "15%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "auto",
    zIndex: 0,
  },

  centeredText: {
    textAlign: "center",
    marginTop: 40,
  },
});
