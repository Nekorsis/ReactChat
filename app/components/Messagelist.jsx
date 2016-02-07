import React from 'react'
var socket = io()

export default class Messagelist extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			messages: [],
		}
	};

	componentDidMount(){
		socket.on('historyload', result =>{
			this.setState({messages: result});
			console.log(result);
		});
		socket.on('msg_sendback', tempObj =>{
			this.setState({ messages: [...this.state.messages, tempObj]});
			console.log(tempObj.messagedate);
		});
	};

	render() {
 		 return (
    		<div className="messagebox">
      			<ol className="messagelist">
        			{this.state.messages.map(function(message) {
         			 	return <li key={message.MessageID}>{message.MessageDate+ ": " + message.Username + ": " + message.MessageValue}</li>;
       				 })}
      			</ol>
    		</div>
  		);
	};
};