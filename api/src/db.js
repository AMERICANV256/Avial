require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_URL, DATABASE_URL } = process.env;

const sequelize = new Sequelize(
  DB_URL,

  {
    logging: false,
    native: false,
    dialect: "postgres",
  }
);

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  Usuarios,
  Productos,
  Mensajes,
  Clientes,
  Cotizaciones,
  Garantia,
  Solicitantes,
  Contacto,
  ContactoProducto,
  HistorialCotizacion,
  Repuestos,
  Favoritos,
  CotizacionIndividual,
} = sequelize.models;

Clientes.belongsTo(Usuarios, {
  foreignKey: "idUsuario",
});

Usuarios.hasMany(Clientes, {
  foreignKey: "idUsuario",
});

Cotizaciones.belongsTo(Usuarios, {
  foreignKey: "idUsuario",
});
Usuarios.hasMany(Cotizaciones, {
  foreignKey: "idUsuario",
});

Cotizaciones.belongsTo(Clientes, {
  foreignKey: "idCliente",
});
Clientes.hasMany(Cotizaciones, {
  foreignKey: "idCliente",
});

Cotizaciones.belongsTo(Productos, {
  foreignKey: "idProducto",
});

Productos.hasMany(Cotizaciones, {
  foreignKey: "idProducto",
});

Cotizaciones.hasMany(CotizacionIndividual, { foreignKey: "idCotizacion" });
CotizacionIndividual.belongsTo(Cotizaciones, { foreignKey: "idCotizacion" });

Mensajes.belongsTo(Usuarios, {
  foreignKey: "idUsuario",
  as: "Emisor",
});

Usuarios.hasMany(Mensajes, {
  foreignKey: "idUsuario",
  as: "MensajesEnviados",
});

Mensajes.belongsTo(Usuarios, {
  foreignKey: "idDestino",
});

Usuarios.hasMany(Mensajes, {
  foreignKey: "idDestino",
});

Contacto.belongsTo(Productos, {
  foreignKey: "idProducto",
});

Productos.hasMany(Contacto, {
  foreignKey: "idProducto",
});

ContactoProducto.belongsTo(Productos, {
  foreignKey: "idProducto",
});

Productos.hasMany(ContactoProducto, {
  foreignKey: "idProducto",
});

ContactoProducto.belongsTo(Usuarios, {
  foreignKey: "idUsuario",
});

Usuarios.hasMany(ContactoProducto, {
  foreignKey: "idUsuario",
});

Contacto.belongsTo(Usuarios, {
  foreignKey: "idUsuario",
});

Usuarios.hasMany(Contacto, {
  foreignKey: "idUsuario",
});

Repuestos.belongsTo(Usuarios, {
  foreignKey: "idUsuario",
});

Usuarios.hasMany(Repuestos, {
  foreignKey: "idUsuario",
});

Garantia.belongsTo(Usuarios, {
  foreignKey: "idUsuario",
});

Usuarios.hasMany(Garantia, {
  foreignKey: "idUsuario",
});

Favoritos.belongsTo(Usuarios, {
  foreignKey: "idUsuario",
});

Usuarios.hasMany(Favoritos, {
  foreignKey: "idUsuario",
});

Favoritos.belongsTo(Productos, {
  foreignKey: "idProducto",
});

Productos.hasMany(Favoritos, {
  foreignKey: "idProducto",
});

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
