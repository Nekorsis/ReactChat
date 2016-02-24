import React from 'react'
var socket = io()

export default class Messages extends React.Component {
	constructor(props){
		super(props)
		this.state= {
			messagevalue: '',
			username: '',
		}
	};
	messageinputchanges = event => {
		this.setState({
			messagevalue: event.target.value
		});
	};
	sendDialogueMessage = () => {
		if(this.state.messagevalue){
			socket.emit('sendDialogueMessage', {currrendDiaglogue: this.props.currrendDiaglogue, userID: this.props.userID, username: this.props.username, messageValue: this.state.messagevalue} );
			this.setState({
				messagevalue: '',
			});
		} else {
			return false;
		}
	};
	sendmessage = () => {
		if(this.state.messagevalue){
			socket.emit('msg', this.props.userID, this.props.username, this.state.messagevalue, this.props.currentRoom);
			this.setState({
				messagevalue: '',
			});
		} else {
			return false;
		};
	};

	render(){
		return(
				<div className="inputdiv">
					<input type="text" placeholder="Enter your message here..." value={this.state.messagevalue} onChange={this.messageinputchanges}/>
					<input type="button" value="Send" onClick={this.sendDialogueMessage}></input>
				</div>
			)
	}
}
