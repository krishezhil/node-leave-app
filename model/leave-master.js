const { Sequelize } = require('sequelize');
const sequelize = require('../util/database')

const LeaveMaster = sequelize.define('LeaveMaster', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    totalLeaves: Sequelize.INTEGER,
    availableLeaves: Sequelize.INTEGER,
    createdBy: Sequelize.STRING,
    modifiedBy: Sequelize.STRING
})

module.exports = LeaveMaster