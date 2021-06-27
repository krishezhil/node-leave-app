const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');


const UserStatus = sequelize.define('UserStatus', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    type: Sequelize.STRING,
    description: Sequelize.STRING
}, {
    tableName: 'EmployeeStatus'
})

module.exports = UserStatus