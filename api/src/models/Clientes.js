const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Clientes",
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
      CUIT: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      domicilio: {
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
      provincia: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ciudad: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactoAlternativo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactoAlternativo1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      razonSocial: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      mailAlternativo: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      mailAlternativo1: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefonoAlternativo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telefonoAlternativo1: {
        type: DataTypes.STRING,
        allowNull: true,
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
    },
    {
      timestamps: false,
    }
  );
};
