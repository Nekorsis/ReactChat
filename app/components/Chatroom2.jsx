import React from 'react'
var socket = io()

export default class Chatroom2 extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			messages: [],
		}
	};
	componentDidMount(){
		socket.on('historyload', result =>{
			this.setState({messages: result});
		});
		socket.on('msg_sendback', tempObj =>{
			this.setState({ messages: [...this.state.messages, tempObj]});
		});
	};

	render() {
 		 return (
    		<div className="messagebox">
    			<h3>Room number 2</h3>
      			<ol className="messagelist">
        			{this.state.messages.map(function(message) {
         			 	return <li key={message.MessageID}>{message.MessageDate+ ": " + message.Username + ": " + message.MessageValue}</li>;
       				 })}
      			</ol>
    		</div>
  		);
	};
};
