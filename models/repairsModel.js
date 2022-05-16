const { DataTypes } = require("sequelize");
const { db } = require("../utils/database");

const Repair = db.define("repair", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.DATE,
  },
  computerNumber: {
    type: DataTypes.INTEGER,
  },
  comments: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = { Repair };
