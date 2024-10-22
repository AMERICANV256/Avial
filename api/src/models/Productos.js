const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Productos",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      division: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      familia: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      marca: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modelo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imagen: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imagen1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imagen2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imagen3: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fichaPDF: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cantidadTotal: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      precioUSD: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      costo: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      codigo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      motor: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      caracteristicasGenerales: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      motoresdeTraslacionyZapatas: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sistemaHidraulico: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      capacidades: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      Cabina: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dimensionesGenerales: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );
};
