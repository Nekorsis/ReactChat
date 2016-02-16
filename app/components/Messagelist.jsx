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
		});
		socket.on('msg_sendback', tempObj =>{
			this.setState({ messages: [...this.state.messages, tempObj]});
		});
	};
	test = () =>{
		console.log('hello');
	};
	render() {
 		 return (
    		<div className="messagebox">
    			<h3>Room number 1</h3>
      			<ol className="messagelist">
        			{this.state.messages.map(function(message) {
         			 	return <li className="messageinstance" key={message.MessageID} onClick={console.log("hello world")}>{message.MessageID+ ": " + message.Username + ": " + message.MessageValue}</li>;
       				 })}
      			</ol>
    		</div>
  		);
	};
};