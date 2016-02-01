import React from 'react'
import Messagelistparent from './Messagelistparent.jsx'
import Messageparent from './Messageparent.jsx'
import Usernameparent from './Usernameparent.jsx'
var socket = io()

export default class Storage extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			UserID: "",
			Username: "",
			Users: [],
		}
	}
	componentDidMount(){
		socket.on('userset', (UserID, Username) => {
			this.setState({
				UserID : UserID,
				Username: Username,
			})
		});
		socket.on('userlist', usernames => {
			this.setState({ Users: [...this.state.Users, usernames]});
			console.log(this.state.Users);
		});
	};
	render (){
		return <div>
					<Messagelistparent/>
					<Messageparent Username={this.state.Username} UserID={this.state.UserID} />
				</div>
	};
};