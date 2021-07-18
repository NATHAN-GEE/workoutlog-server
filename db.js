const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "postgres://postgres:Nathangee23!!!@localhost:5432/workout"
);
module.exports = sequelize;
