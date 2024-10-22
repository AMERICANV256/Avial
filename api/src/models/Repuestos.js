const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Repuestos",
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
      apellidos: {
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
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      repuesto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Repuestos",
      timestamps: true,
    }
  );
};
