
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4000;
var usersdb = require('./src/users');
var messagedb = require('./src/messages');
var chat2 = require('./src/chatroom2');
var chat3 = require('./src/chatroom3');

app.set('view engine', 'jade');
app.use(express.static('build'));

http.listen(port, function() {
	console.log("server is up");
});

var usernames = [];

app.get('/', function (req, res){
	res.render('index');
});

function SimpleValidation(name){
	for (var i = 0; i<usernames.length; i++){
		if (usernames[i].username === name){
			return true
		}
	}
};
	var tempObj2 = {
					username: "Nekorsis2",
					ID: 2
				};
	usernames.push(tempObj2);
io.on('connection', function (socket){
	console.log(usernames);
	var initialLoad = false;
	if (!initialLoad){
		messagedb.Messages.findAll({
			where: {
				MessageID: {
					gt: 0
				}
			}
		}).then(function (Messages){
			result = Messages.map(instance => instance.toJSON());
			io.sockets.connected[socket.id].emit('historyload', result)
		});
		initialLoad = true;
	};
	socket.on('reqest history 1', function(){
		messagedb.Messages.findAll({
			where: {
				MessageID: {
					gt: 0
				}
			}
		}).then(function (Messages){
			result = Messages.map(instance => instance.toJSON());
			io.sockets.connected[socket.id].emit('historyload', result)
		});
	});
	socket.on('reqest history 2', function(){
		chat2.chatroom2.findAll({
			where: {
				MessageID: {
					gt: 0
				}
			}
		}).then(function (Messages){
			result = Messages.map(instance => instance.toJSON());
			io.sockets.connected[socket.id].emit('historyload', result)
		});
	});
	socket.on('reqest history 3', function(){
		chat3.chatroom3.findAll({
			where: {
				MessageID: {
					gt: 0
				}
			}
		}).then(function(Messages){
			result = Messages.map(instance => instance.toJSON());
			io.sockets.connected[socket.id].emit('historyload', result);
		});
	});

	usersdb.Users.findAll({
		where: {
			UserID: {
				gt: 0
			}
		}
	}).then(function(userlist){
		result = userlist.map(instance => instance.toJSON());
		io.sockets.connected[socket.id].emit('userlist', result);
		io.sockets.emit('users online', usernames);
	});

	socket.on('loginuser', function(username, password){
		if (SimpleValidation(username)){
			io.sockets.connected[socket.id].emit('overlap');
		} else {
			usersdb.Users.findOrCreate({
				where: {Username: username, password: password},
				defaults: {Username: username, password: password}
			}).spread(function(userinstance){
				socket.username = userinstance.Username;
		
				var tempObj = {
					username: userinstance.Username,
					ID: userinstance.UserID
				};
				usernames.push(tempObj);
				console.log(usernames);
				io.sockets.emit('users online', usernames);
				io.sockets.connected[socket.id].emit('userset', userinstance.UserID, userinstance.Username);
				return true;
			})
		}
	});

	socket.on('disconnect', function(){
		for (var i = 0; i<usernames.length; i++){
			if (usernames[i].username === socket.username){
				usernames.splice(i, 1);
			}
		}
	});

	socket.on('msg', function(UserID, Username, MessageValue, currentRoom){
	switch(currentRoom){
		case 1:
			messagedb.Messages.create({
				UsersendID: UserID,
				Username: Username,
				MessageValue: MessageValue
			}).then(function(message){
				io.sockets.emit('msg_sendback', {UserID, Username, MessageID: message.MessageID, MessageValue, MessageDate: message.createdAt});
			});
			break;
		case 2:
			chat2.chatroom2.create({
				UsersendID: UserID,
				Username: Username,
				MessageValue: MessageValue
			}).then(function(message){
				io.sockets.emit('msg_sendback', {UserID, Username, MessageID: message.MessageID, MessageValue, MessageDate: message.createdAt});
			});
			break;
		case 3:
			chat3.chatroom3.create({
				UsersendID: UserID,
				Username: Username,
				MessageValue: MessageValue
			}).then(function(message){
				io.sockets.emit('msg_sendback', {UserID, Username, MessageID: message.MessageID, MessageValue, MessageDate: message.createdAt});
			});
			break;
	};
	});
});



