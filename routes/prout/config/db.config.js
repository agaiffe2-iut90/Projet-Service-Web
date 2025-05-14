module.exports = {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'bdd_sw',
    DB_PORT: process.env.DB_PORT || 5432,
    PASSWORD: process.env.DB_PASSWORD || 'Shaco25',
    DB: process.env.DB_NAME || 'ponnyhappy',
    dialect: process.env.DB_DIALECT || 'postgres',
};