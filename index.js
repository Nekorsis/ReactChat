
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4000;
var usersdb = require('./src/users');
var messagedb = require('./src/messages');

app.set('view engine', 'jade');
app.use(express.static('build'));

http.listen(port, function() {
	console.log("server is up");
});

var usernames = [];

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
/*
messagedb.Messages.findAll({
	where: {
		MessageID: {
			gt: 0
		}
	}
}).then(function (Messages){
	result = Messages.map(instance => instance.toJSON());
});
*/
io.on('connection', function (socket){
	io.sockets.connected[socket.id].emit('userlist', usernames);	
	var addedUser = false;
	var historyload = true;	
	if (historyload){
		messagedb.Messages.findAll({
			where: {
				MessageID: {
					gt: 0
				}
			}
		}).then(function (Messages){
			result = Messages.map(instance => instance.toJSON());
			io.sockets.connected[socket.id].emit('historyload', result)
			historyload = false;
		})
	};	

	socket.on('loginuser', function(username){
		usersdb.Users.findOrCreate({
			where: {Username: username},
			defaults: {Username: username}
		}).spread(function(userinstance){
			socket.username = userinstance.Username;
			addedUser = true;
			var tempObj = {
				username: userinstance.Username,
				ID: userinstance.UserID
			};
			usernames.push(tempObj);
			console.log(usernames);
			io.sockets.emit('userlist', usernames);
			io.sockets.connected[socket.id].emit('userset', userinstance.UserID, userinstance.Username);	
		});
	});
	socket.on('disconnect', function(){
		//delete usernames[tempObj];
		for (var i = 0; i<usernames.length; i++){
			if (usernames[i].username === socket.username){
				usernames.splice(i, 1);
			}
		}
		console.log("after disconnect: ", usernames);
		io.sockets.emit('userlist', usernames);
	});
	socket.on('msg', function(UserID, Username, MessageValue){
		messagedb.Messages.sync({force: false}).then(function (){
			return messagedb.Messages.create({
				UsersendID: UserID,
				Username: Username,
				MessageValue: MessageValue
			}).then(function(Messages){
				io.sockets.emit('msg_sendback', {UserID, Username, MessageID: Messages.MessageID, MessageValue});
			}).catch(function (err){
				console.log(err);
			});
		});
	});
});



