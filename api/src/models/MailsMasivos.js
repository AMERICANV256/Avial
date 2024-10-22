const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "MailsMasivos",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      emailEmisor: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      emailReceptor: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      cuerpoMensaje: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imagen: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imagen1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pdf: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "MailsMasivos",
      timestamps: false,
    }
  );
};
