var Sequelize = require('sequelize');

var sequelize = new Sequelize('UsersDB', 'Nekorsis', '529406ab', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 50,
    min: 0,
    idle: 10000
  },
});

var Messages = sequelize.define('MesagesTable', {
  DialogueID:{
    type: Sequelize.STRING,
    field: 'DialogueID'
  },
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
module.exports = {sequelize, Messages};
