const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Cotizaciones",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      numeroCotizacion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      codigoCotizacion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      plazoEntrega: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      formaPago: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mantenimientoOferta: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lugarEntrega: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      garantia: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entregaTecnica: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      origenFabricacion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      patentamiento: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      fechaDeCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      fechaModi: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fechaVenta: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notasEmail: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notasUsuario: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      CotizacionPDF: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "Cotizaciones",
      timestamps: false,
    }
  );
};
