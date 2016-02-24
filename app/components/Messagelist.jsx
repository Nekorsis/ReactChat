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
	deleteMessage = (id) =>{
		socket.emit('message delete', id);
	};
	parseDate = (date) =>{
		let tempDate = date.split("-");
		let parsedOnce = tempDate[2].substr(3);
		let parsedTwice = parsedOnce.substr(0, parsedOnce.length-5);
		return parsedTwice;
	};
	render() {
 		 return (
    		<div className="messagebox">
    			<h3>Room number 1</h3>
      			<ol className="messagelist">
        			{this.state.messages.map((message) => {
         			 	return <li className="messageinstance" key={message.MessageID}>{this.parseDate(message.MessageDate) + " " + message.Username + ": " + message.MessageValue}<span onClick={this.deleteMessage.bind(null, message.MessageID)}><img src="http://puu.sh/n7gS4/727065f7c0.png"/></span></li>;
       				 })}
      			</ol>
    		</div>
  		);
	};
};
