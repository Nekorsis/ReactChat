import React from 'react'
import Loginform from './Loginform.jsx'
import Messages from './Messages.jsx'
import Messagelist from './Messagelist.jsx'
import Chatroom2 from './Chatroom2.jsx'
import Chatroom3 from './Chatroom3.jsx'
var socket = io()

export default class Layout extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			userID: "",
			username: "",
			users: [],
			charRooms: [],
			currentRoom: "",
			usersonline: [],
		}
	}
	componentDidMount(){
		this.setState({
			chatRooms: [1,2,3],
			currentRoom: 1,
		});
		socket.on('overlap', () =>{
			alert('this username is already in use');
		});
		socket.on('userset', (userID, username) => {
			this.setState({
				userID: userID,
				username: username,
			})
			this.forceUpdate();
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
	swtichRoom1 = () =>{
		this.setState({
			currentRoom: 1, 
		});
		socket.emit('reqest history 1');
	};
	swtichRoom2 = () =>{
		this.setState({
			currentRoom: 2,
		});
		socket.emit('reqest history 2');
	};
	swtichRoom3 = () =>{
		this.setState({
			currentRoom: 3,
		});
		socket.emit('reqest history 3');
	};
	render() {
		return (
			<div>
				<div className="mainroom">
					<div className="userlist">
					<h4>Users list:</h4>
					<ol className="ol userlist">
	        		{this.state.users.map((user) => {
	        			return <li key={user.UserID} className={this.state.usersonline.includes(user.Username) ? 'useronline' : ' '}>{user.Username}</li>;
   					})}
	      			</ol>
	      			</div>
					{this.state.username ? " ": <Loginform/>}
					<div>
						<button className="switchrooms" onClick={this.swtichRoom1}>Room 1</button>
						<button className="switchrooms" onClick={this.swtichRoom2}>Room 2</button>
						<button className="switchrooms" onClick={this.swtichRoom3}>Room 3</button>
						{this.state.currentRoom == 1 ? <Messagelist/> : " " }
						{this.state.currentRoom == 2 ? <Chatroom2/> : " "}
						{this.state.currentRoom == 3 ? <Chatroom3/> : " "}
					</div>
					{!this.state.username ? " ": <Messages username={this.state.username} userID={this.state.userID} currentRoom={this.state.currentRoom}/>}
				</div>
			</div>
		)
	}
}
