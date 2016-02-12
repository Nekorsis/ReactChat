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
	};
	componentDidMount(){
		socket.on('userset', (UserID, Username) => {
			this.setState({
				UserID : UserID,
				Username: Username,
			})
		});
		socket.on('userlist', usernames => {
			let testArr = [];
			usernames.map((arr) =>{
				testArr.push(arr);
			});
			this.setState({Users: testArr});
		});
	};
	render (){
		return <div>
					<div>
					<h4>Users online:</h4>
					<ol className="test2">
        				{this.state.Users.map(function(user) {
         			 		return <li key={user.ID}>{user.username}</li>;
       					 })}
      				</ol>
      				</div>
					<Messageparent Username={this.state.Username} UserID={this.state.UserID} />
				</div>
	};
};