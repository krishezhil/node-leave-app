// const sql = require('mssql')
const { Sequelize } = require('sequelize');

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('lms', 'sa', 'wXJZz2Qw5Bz3PQ', {
    host: 'localhost',
    dialect: 'mssql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    logging: false
});

const config = {
    user: 'sa',
    password: 'wXJZz2Qw5Bz3PQ',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'lms',
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
    }
}

module.exports = sequelize



