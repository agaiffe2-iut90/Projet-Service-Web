const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ponnyhappy', 'bdd_sw', 'Shaco25', {
    host: 'localhost',
    dialect: 'postgres',
}
)

module.exports = sequelize;