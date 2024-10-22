const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Mensajes",
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
      idDestino: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      Mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      fechaDeEnvio: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Mensajes",
      timestamps: false,
    }
  );
};
