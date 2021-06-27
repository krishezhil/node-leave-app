const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database')

const LeaveRequest = sequelize.define('LeaveRequest', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fromDate: DataTypes.DATE,
    toDate: DataTypes.DATE,
    noOfDays: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    isHalfDay: Sequelize.BOOLEAN,
    reason: Sequelize.STRING,
    supervisor: {
        type: Sequelize.STRING,
        allowNull: false
    },
    comments: Sequelize.STRING,
    createdBy: Sequelize.STRING,
    modifiedBy: Sequelize.STRING
})

module.exports = LeaveRequest