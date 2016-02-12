var Sequelize = require('sequelize');
var config = require('../config.js');

var sequelize = new Sequelize('UsersDB', config.username, '529406ab', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 50,
    min: 0,
    idle: 10000
  },
});

var chatroom3 = sequelize.define('Chatroom3', {
	UsersendID:{
		type: Sequelize.INTEGER,
		field: 'UsersendID'
	},
	Username:{
		type: Sequelize.STRING,
		field: 'Username'
	},
	MessageID: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		field: 'messageid'
	},
	MessageValue: {
		type: Sequelize.STRING,
		field: 'messagevalue'
	},
	MessageDate: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	}
});
module.exports = {sequelize, chatroom3}; 