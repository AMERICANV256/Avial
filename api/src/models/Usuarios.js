const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Usuarios",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      distribuidor: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      nombre: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      apellido: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      direccion: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      telefono: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      codigo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        allowNull: false,
      },
      rol: {
        // null: basic user ; false: admin user ; true: super admin user
        type: DataTypes.BOOLEAN,
        defaultValue: null,
      },
      activo: {
        // false: banned/disabled ; true: active
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      baneado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      firma: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
    },
    {
      updatedAt: false,
    }
  );
};
