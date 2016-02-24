
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

function SimpleValidation(name){
	for (var i = 0; i<usernames.length; i++){
		if (usernames[i].username === name){
			return true
		}
	}
};
/*
usersdb.Users.sync({force: true}).then(function () {
  // Table created
  return Users.create({
  	UserID: 4,
    Username: 'Nekorsis666',
    password: '123'
  });
});
*/
/*
messagedb.Messages.findAll({
	where: {
		MessageID: {
			gt: 0
		}
	}
}).then(function (Messages){
	result = Messages.map(instance => instance.toJSON());
	console.log(result);
});
*/

usersdb.Users.findAll({
		where: {
			UserID: {
				gt: 0
			}
		}
	}).then(function(userlist){
		result = userlist.map(instance => instance.toJSON());
		console.log(result);
	});

io.on('connection', function (socket){

	socket.on('startSingleConversation', (username) =>{
		usersdb.Users.findOne({
			where: {
				Username: username
			}
		}).then((userinstance)=> {
			io.sockets.connected[socket.id].emit('startSingleConversationSendBack', {UserID: userinstance.UserID, Username: userinstance.Username});
		});
	});
	socket.on('sendDialogueMessage', (messageObject) =>{
		console.log(messageObject);
		messagedb.Messages.create({
			DialogueID: messageObject.currrendDiaglogue,
			UsersendID: messageObject.userID,
			Username: messageObject.username,
			MessageValue: messageObject.messageValue,
		}).then((messageinstance) =>{
				io.sockets.connected[socket.id].emit('singleDialogueSendBack', messageinstance);
		});
		/*
		messagedb.Messages.sync({force: false}).then(()=>{
			return Messages.create({
				DialogueID: messageObject.currrendDiaglogue,
				UsersendID: messageObject.userID,
				Username: messageObject.username,
				MessageValue: messageObject.MessageValue,
			});
		});
		*/
	});
	socket.on('requestDialogueHistory',(dialogueID)=>{
		messagedb.Messages.findAll({
			where: {
				DialogueID: dialogueID
			}
		}).then((dialogueHistory)=>{
			result = dialogueHistory.map(instance => instance.toJSON());
			io.sockets.connected[socket.id].emit('dialogueHistorySendBack', result);
		})
	});
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
			//io.sockets.connected[socket.id].emit('historyload', result)
			//io.sockets.emit('redux test', result);
		});
		initialLoad = true;
	};

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
	socket.on('message delete', function(id){
		messagedb.Messages.findOne({
			where:{
				MessageID: id,
			}
		}).then(function(messageinstance){
			messageinstance.destroy();
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
	});
	socket.on('addFriend', function(friendUsername, friendUserID, userID){
		console.log("addFriend: ",friendUsername, friendUserID, userID);

		usersdb.Users.findOne({
			where: {
				UserID: userID
			}
		}).then((userinstance)=>{
			var tempArr = userinstance.friends.split(',');
			console.log(tempArr);
			if(tempArr.includes(friendUserID)){
				console.log('fail');
			} else {
				console.log('true');
			};
		});


	});
});
