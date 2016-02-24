import React from 'react'
var socket = io()

export default class Loginform extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			username: '',
			password: '',
		}
	};
	usernameChanges = event => {
		this.setState({
  			username: event.target.value
  		});
	};
	passwordChanges = event => {
		this.setState({
			password: event.target.value
		});
	};
	sednAuth = () => {
		if (this.state.username && this.state.password){
			socket.emit('loginuser', this.state.username, this.state.password);
			this.setState({
				username: '',
				password: '',
			})
		} else {
			return false;
		}
	};
	render(){
		return (
				<div className="overlay">
					<div className="overlayinner">
					<form method="POST" action='/' className="Loginform" onSubmit={this.handleSubmit}>
						<label htmlFor="Usernameinput">Enter your name and password</label>
						<input type="text" id="Usernameinput" maxLength="20" value={this.state.username} onChange={this.usernameChanges}/>
						<input type="password" id="Passwordinput" maxLength="14" value={this.state.password} onChange={this.passwordChanges}/>
						<input type="button" className="Loginform button" value="Login" onClick={this.sednAuth}/>
					</form>
					</div>
				</div>
			)
	}
}
