import React from 'react'
import Messagebox from './Messagebox.jsx'
import Messageinstance from './Messageinstance.jsx'
var socket = io()


export default class Messagelistparent extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			text: '',
			messages: [],
		}
	};

	componentDidMount(){ 	
		socket.on('msg_sendback', tempObj =>{
			this.setState({ messages: [...this.state.messages, tempObj]}); // немного понятно
		});
	};

render() {
 		 return (
    		<Messagebox>
      			<ol className="msg_list">
        			{this.state.messages.map(function(message) {
         			 	return <li key={message.msgID}>{message.userName + ": " + message.msgVal}</li>;
       				 })}
      			</ol>
    		</Messagebox>
  		);
	};
};

