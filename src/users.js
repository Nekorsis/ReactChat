var Sequelize = require('sequelize');
var config = require('../config.js');

var sequelize = new Sequelize('UsersDB','root', '529406ab', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 50,
    min: 0,
    idle: 10000
  },
});

var Users = sequelize.define('UsersTable', {
	UserID: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		field: 'userid'
	},
	Username: {
		unique: true,
		type: Sequelize.STRING,
		unique: true,
		field: 'username',
	},
	friends: {
		type: Sequelize.STRING,
		field: 'friends',
	},
	password: {
		type: Sequelize.STRING,
		field: 'password',
	},
	salt: {
		type: Sequelize.STRING,
		field: 'salt',
	}
}, {
	freezeTableName: true
});

module.exports = {sequelize, Users};
