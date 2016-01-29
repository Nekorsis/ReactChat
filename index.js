var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4000;
var usersdb = require('./src/users');
var messagedb = require('./src/messages');

app.set('view engine', 'jade');
app.use(express.static('build'));

http.listen(port, () => {
	console.log("server is up");
});

var usernames = {};

app.get('/', function (req, res){
	res.render('index');
});


usersdb.Users.findAll({
	where: {
		UserID: {
			gt: 0
		}
	}
}).then(function (Users) {
	result = Users.map(instance => instance.toJSON());
});

messagedb.Messages.findAll({
	where: {
		MessageID: {
			gt: 0
		}
	}
}).then(function (Messages){
	result = Messages.map(instance => instance.toJSON());
	console.log(result);
})


io.on('connection', function (socket){
	var historyload = true;
	var addedUser = false;
	socket.on('test_react_msg', function(data){
		console.log('its fucking happening ' + data);
		io.sockets.emit('test_react_sendback', data);
	});
	socket.on('loginuser', function(username){
		usersdb.Users.findOrCreate({
			where: {Username: username},
			defaults: {Username: username}
		}).spread(function(userinstance){
			console.log('We found this: ' + userinstance.UserID + " " + userinstance.Username + " " + userinstance.createdAt);
			//эмитить найденные данные
			io.sockets.connected[socket.id].emit('test2', userinstance.UserID, userinstance.Username);
		});
	});

	socket.on('msg', function(userID, userName, msgVal){
		console.log("event called " + userID + " " + userName + " " + msgVal);
		messagedb.Messages.sync({force: false}).then(function (){
			return messagedb.Messages.create({
				UsersendID: userID,
				MessageValue: msgVal
			}).then(function(Messages){
				io.sockets.emit('msg_sendback', {userID, userName, msgID: Messages.MessageID, msgVal});
			}).catch(function (err){
				console.log(err);
			});
		});
	});
});



