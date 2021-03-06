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
		/*eslint-disable no-alert, no-console */
		console.log('server is up');
		/*eslint-enable no-alert */
	});

	var usernames = [];

	app.get('/', function (req, res){
		res.render('index');
	});

	function SimpleValidation(name){
		for (var i = 0; i<usernames.length; i++){
			if (usernames[i].username === name){
				return true;
			}
		}
	}

	io.on('connection', function (socket){
		var roomname;
		var testArr = [];
		usersdb.Users.findAll({
			where: {
				UserID: {
					gt: 0
				}
			}
		}).then(function(userlist){
			const result = userlist.map(instance => instance.toJSON());
			io.sockets.connected[socket.id].emit('userlist', result);
		});
		socket.on('addFriend', (friendusername, friendid, userid)=>{
			usersdb.Users.findOne({
				where: {UserID: userid}
			}).then((userinstance)=>{
				testArr = userinstance.friends.split(',');
				console.log(testArr);
			});
		});

		socket.on('setRoom', (username, userid, myid)=>{
			socket.leave(roomname);
			roomname = userid+myid; // fix this
			console.log('roomname: ' + roomname);
			socket.join(roomname);
			socket.room =  roomname;
			io.to(roomname).emit('roomisset', roomname);
			messagedb.Messages.findAll({
				where: {
					DialogueID: roomname,
				}
			}).then((messagelist)=>{
				const result = messagelist.map(instance => instance.toJSON());
				io.to(roomname).emit('history', result);
			});
		});
		socket.on('msg to room', (messageobject)=>{
			messagedb.Messages.create({
				DialogueID: roomname,
				UsersendID: messageobject.userid,
				Username: messageobject.username,
				MessageValue: messageobject.messagevalue,
			}).then((messageinstance)=>{
				io.to(roomname).emit('msg sendback', messageinstance);
			});
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
					io.sockets.connected[socket.id].emit('userset',
					{userid: userinstance.UserID, username: userinstance.Username});
					return true;
				});
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
					const result = Messages.map(instance => instance.toJSON());
					io.sockets.connected[socket.id].emit('historyload', result);
				});
			});
		});
	});
