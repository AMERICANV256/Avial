const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "ContactoProducto",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idUsuario: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      razonSocial: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
          isEmail: true,
        },
      },
      telefonoCelular: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fechaDeRegistro: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      pagoContado: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      cuotas: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      anticipo: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      moneda: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "ContactoProducto",
      timestamps: false,
    }
  );
};
