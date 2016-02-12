var passport = require('passport');
var usersdb = require('./src/users');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){
	  app.use(passport.initialize());
	  app.use(passport.session());

	  passport.use(new LocalStrategy(function(username, password, done){
	  	usersdb.Users.finOne({
	  		where: {
	  			Username: usernmae
	  		}
	  	}).then(function(user){
	  		if (user == null){
	  			return done(null, false, {message: "Incorrect user"})
	  		}
	  		if(user.password === password) {
	  			return done(null, user)
	  		}
	  		return done(null, false, {message: "Incorrect user"})
	  	})
	  }))
}
