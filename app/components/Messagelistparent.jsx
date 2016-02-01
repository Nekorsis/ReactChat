import React from 'react'
import Messagebox from './Messagebox.jsx'
var socket = io()


export default class Messagelistparent extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			messages: [],
		}
	};

	componentDidMount(){
		socket.on('historyload', result =>{
			this.setState({messages: result});
			console.log(this.state.messages);
		});
		socket.on('msg_sendback', tempObj =>{
			console.log(tempObj);
			this.setState({ messages: [...this.state.messages, tempObj]});
		});
	};

render() {
 		 return (
    		<Messagebox>
      			<ol className="msg_list">
        			{this.state.messages.map(function(message) {
         			 	return <li key={message.MessageID}>{message.Username + ": " + message.MessageValue}</li>;
       				 })}
      			</ol>
    		</Messagebox>
  		);
	};
};

