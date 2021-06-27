const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database')

const LeaveRequestStatus = sequelize.define('LeaveRequestStatus', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    statusType: Sequelize.STRING,
    descrition: Sequelize.STRING,
    modifiedBy: Sequelize.STRING
})

module.exports = LeaveRequestStatus
