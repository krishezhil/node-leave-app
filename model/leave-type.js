const { Sequelize } = require('sequelize');
const sequelize = require('../util/database')

const LeaveType = sequelize.define('LeaveType', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    leaveType: Sequelize.STRING,
    leaveDesc: Sequelize.STRING
    //TODO: We can add createdBy if needed in the future
})

module.exports = LeaveType

