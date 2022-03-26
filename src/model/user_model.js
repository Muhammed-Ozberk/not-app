const { Sequelize } = require('sequelize');
const sequelize = require('../db/database');

const User = sequelize.define('user_table', {
    id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true,
    },
    email: {
       type: Sequelize.STRING,
       allowNull: false,
    },
    name: { 
       type: Sequelize.STRING,
    },
    password: {
       type: Sequelize.STRING,
       allowNull: false,
    },
}, {
   timestamps:true,
   updatedAt:false
});

module.exports = User;