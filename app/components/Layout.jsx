import React from 'react'
import Loginform from './Loginform.jsx'
import Messages from './Messages.jsx'
import Messagelist from './Messagelist.jsx'
var socket = io()

export default class Layout extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			userID: "",
			username: "",
			users: [],
		}
	}
	componentDidMount(){
		socket.on('overlap', () =>{
			alert('this username is already in use');
		});
		socket.on('userset', (userID, username) => {
			this.setState({
				userID: userID,
				username: username,
			})
		});
		socket.on('userlist', usernames => {
			let testArr = [];
			usernames.map((arr) => {
				testArr.push(arr);
			});
			this.setState({users: testArr});
		});
	};
	render() {
		return (
			<div>
				<div className="userlist">
				<h4>Users online:</h4>
				<ol className="ol userlist">
        				{this.state.users.map(function(user) {
         			 		return <li key={user.ID}>{user.username}</li>;
       					 })}
      			</ol>
      			</div>
				{this.state.username ? " ": <Loginform/>}
				<Messagelist/>
				{!this.state.username ? " ": <Messages username={this.state.username} userID={this.state.userID}/>}
			</div>
		)
	}
}
