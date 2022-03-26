const { Sequelize } = require('sequelize');
const sequelize = require('../db/database');

const AdminUser = sequelize.define('admin_user', {
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
    password: {
       type: Sequelize.STRING,
       allowNull: false,  
    },
});

module.exports = AdminUser;