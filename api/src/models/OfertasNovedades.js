const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "OfertasNovedades",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      novedades: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      foto: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "OfertasNovedades",
      timestamps: false,
    }
  );
};
