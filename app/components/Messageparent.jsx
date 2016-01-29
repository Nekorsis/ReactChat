import React from 'react'
import Messageinput from './Messageinput.jsx'
import Messagesend from './Messagesend.jsx'
import Usernameinput from './Usernameinput.jsx'
import Usernamebutton from './Usernamebutton.jsx'
var socket = io()


export default class Messageparent extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			MsgText: '',
			username: '',
		}
	};
	setUsername = () => {
		socket.emit('loginuser', this.state.username);
		this.setState({
			username: ""
		})
	};
	sendToServer = () => {
		console.log('Send to server: ' + this.props.userID + " " + this.props.username + " " + this.state.MsgText);
   		socket.emit('msg', this.props.userID, this.props.username, this.state.MsgText);
   		this.setState({
   			MsgText: "" 
   		})
  	};
  	changeTextUserField = event => {
  		this.setState({
  			username: event.target.value
  		})
  	};
	changeTextMsgField = event => {
	    this.setState({
	    	MsgText: event.target.value
	    })
	};
	render() {
    	return (
     	 <div>
     	 	<Messageinput text={this.state.MsgText} onChange={this.changeTextMsgField} />
     	 	<Messagesend onClick={this.sendToServer} />
     	 	{this.props.username ? " " : <Usernameinput text={this.state.username} onChange={this.changeTextUserField} />}
     	 	{this.props.username ? " " : <Usernamebutton onClick={this.setUsername} />}
     	 </div>
   		 )
 	};
};