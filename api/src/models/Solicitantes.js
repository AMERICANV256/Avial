const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Solicitantes",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombreCompleto: {
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
      envioCV: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: "Solicitantes",
      timestamps: true,
    }
  );
};
