import React from 'react'
import Loginform from './Loginform.jsx'
import Messages from './Messages.jsx'
import Messagelist from './Messagelist.jsx'
import {connect} from 'react-redux'

var socket = io()

export default class Layout extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			userID: "",
			username: "",
			users: [],
			usersonline: [],
			friendsList: [],
			dialogues: [],
			currrendDiaglogue: "",
			dialogueMessages: [],
			dialogueUsername: "",
		}
	}
	componentDidMount(){
		socket.on('friendlist', (friends)=>{
			console.log(friends);
		});
		socket.on('dialogueHistorySendBack',(dialogueHistory)=>{
			this.setState({
				 dialogueMessages: dialogueHistory
			});
		});
		socket.on('singleDialogueSendBack', (messageinstance)=>{
			this.setState({
				 dialogueMessages: [...this.state.dialogueMessages, messageinstance]
			});
		});
		socket.on('startSingleConversationSendBack', (userinstance)=>{
			let tempUserId = this.state.userID;
			this.setState({
				dialogueUsername: userinstance.Username,
				currrendDiaglogue: tempUserId +"."+ userinstance.UserID,
			});
			socket.emit('requestDialogueHistory', this.state.currrendDiaglogue);
		});
		socket.on('overlap', () =>{
			alert('this username is already in use');
		});
		socket.on('userset', (userID, username) => {
			this.setState({
				userID: userID,
				username: username,
			})
		});
		socket.on('users online', useronline => {
			let testArr = [];
			useronline.map((arr) => {
				testArr.push(arr);
			});
			this.setState({usersonline: testArr});
		});
		socket.on('userlist', usernames => {
			this.setState({users: usernames});
		});
	};
	parseDate = (date) =>{
		let tempDate = date.split("-");
		let parsedOnce = tempDate[2].substr(3);
		let parsedTwice = parsedOnce.substr(0, parsedOnce.length-5);
		return parsedTwice;
	};
	addFriend = (friendUsername, friendUserID) =>{
		//not working right now
		if(!this.state.username){
			return false
		} else {
			//socket.emit('addFriend', friendUsername, friendUserID, this.state.userID);
			console.log('addFriend: ', friendUsername);
		};
	};
	startConversation = (username) =>{
		if(this.state.username && this.state.username != username){
			socket.emit('startSingleConversation', username);
		} else {
			return false;
		};
	};
	render() {
		return (
			<div>
				<div className="mainroom">
					<div className="userlist">
					<h4>Users list:</h4>
					<ol className="ol userlist">
	        		{this.state.users.map((user) => {
	        			return <li key={user.UserID}  className={this.state.usersonline.includes(user.Username) ? 'useronline' : ' '}><div onClick={this.startConversation.bind(null, user.Username)}>{user.Username}</div><span onClick={this.addFriend.bind(null, user.Username, user.UserID)}><img src="http://puu.sh/nb58l/ff58ac09fc.png"/></span></li>;
   					})}
	      	</ol>
					<h4>Friends:</h4>
	      	</div>
					{this.state.username ? " ": <Loginform/>}
					<div className="messagebox">
						<h2>Dialogue with {this.state.dialogueUsername}</h2>
						<div className={this.state.currrendDiaglogue}>
							<ol>
								{this.state.dialogueMessages.map((message)=>{
									return <li key={message.MessageID}>{message.MessageDate + ": " + message.MessageValue}</li>
								})}
							</ol>
						</div>
					</div>
					{!this.state.username && this.state.currrendDiaglogue ? " ": <Messages username={this.state.username} userID={this.state.userID} currrendDiaglogue={this.state.currrendDiaglogue}/>}
				</div>
			</div>
		)
	}
}
