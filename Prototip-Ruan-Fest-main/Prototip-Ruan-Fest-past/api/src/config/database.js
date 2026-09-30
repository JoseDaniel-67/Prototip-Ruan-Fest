const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const pastaDoBanco = path.resolve(__dirname, "../../database");
fs.mkdirSync(pastaDoBanco, { recursive: true });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(pastaDoBanco, "ruanfest.sqlite"),
  logging: process.env.DB_LOGGING === "true" ? console.log : false
});

module.exports = sequelize;
