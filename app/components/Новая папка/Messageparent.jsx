import React from 'react'
import Messageinput from './Messageinput.jsx'
import Messagesend from './Messagesend.jsx'
import Usernameinput from './Usernameinput.jsx'
import Userpasswordinput from './Userpasswordinput.jsx'
import Usernamebutton from './Usernamebutton.jsx'
var socket = io()


export default class Messageparent extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			MessageValue: '',
			Username: '',
		}
	};
	setUsername = () => {
		socket.emit('loginuser', this.state.Username);
		this.setState({
			Username: ""
		})
	};
	sendToServer = () => {
   		socket.emit('msg', this.props.UserID, this.props.Username, this.state.MessageValue);
   		this.setState({
   			MessageValue: "" 
   		})
  	};
  	changeTextUserField = event => {
  		this.setState({
  			Username: event.target.value
  		})
  	};
	changeTextMsgField = event => {
	    this.setState({
	    	MessageValue: event.target.value
	    })
	};
	render() {
    	return (
     	 <div>
     	 	{ !this.props.Username ? " ": <Messageinput text={this.state.MessageValue} onChange={this.changeTextMsgField} />}
     	 	{ !this.props.Username ? " ": <Messagesend onClick={this.sendToServer} />}
     	 	<Userpasswordinput/>
     	 	{this.props.Username ? " " : <Usernameinput text={this.state.Username} onChange={this.changeTextUserField} />}
     	 	{this.props.Username ? " " : <Usernamebutton onClick={this.setUsername} />}
     	 </div>
   		 )
 	};
};