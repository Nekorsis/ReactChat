import React from 'react'
import Messagelistparent from './Messagelistparent.jsx'
import Messageparent from './Messageparent.jsx'
import Usernameparent from './Usernameparent.jsx'
var socket = io()

export default class Storage extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			userID: "",
			username: "",
		}
	}
	componentDidMount(){
		socket.on('test2', (userID, username)=> {
			console.log("Storage data: ", userID, username);
			this.setState({
				userID : userID,
				username: username,
			})
		});
	};
	render (){
		return <div>
					<Messagelistparent/>
					<Messageparent username={this.state.username} userID={this.state.userID} />
				</div>
	};
};