const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Garantia",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      empresa: {
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
      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipoDeMaquina: {
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
      numeroDeChasis: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fechaEntregaDelEquipo: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ubicacion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cantidadHorasHorometro: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      falla: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      fechaCrea: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: "Garantia",
      timestamps: false,
    }
  );
};
