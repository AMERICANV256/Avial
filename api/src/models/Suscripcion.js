const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Suscripcion",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      tableName: "Suscripcion",
      timestamps: true,
    }
  );
};
