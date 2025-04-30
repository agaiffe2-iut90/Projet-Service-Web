require('dotenv').config();

module.exports = {
    hostname: process.env.HOSTNAME || 'localhost',
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Shaco25",
    database: process.env.DB_NAME || "bdd_node_1",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};