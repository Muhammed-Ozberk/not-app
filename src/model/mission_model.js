const {Sequelize} = require('sequelize');
const sequelize = require('../db/database');

const Missions = sequelize.define('mission_table', {
    id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true,
    },
    userEmail: {
        type: Sequelize.STRING,
        allowNull:false
    },
    title: {
        type: Sequelize.STRING,
    },
    description: {
        type: Sequelize.STRING,
    },
    isComplete: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
    },
}, {
    timestamps: true,
    createdAt: false,
    updatedAt:'createdAt'
});


module.exports = Missions;