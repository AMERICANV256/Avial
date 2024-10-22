const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Favoritos",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idProducto: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      idUsuario: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "Favoritos",
      timestamps: false,
    }
  );
};
