  import React from 'react'
  import Loginform from './Loginform.jsx'
  import Messages from './Messages.jsx'
  import {connect} from 'react-redux'
  var socket = io()
  const parseDate = (date) =>{
    let tempDate = date.split("-");
    let parsedOnce = tempDate[2].substr(3);
    let parsedTwice = parsedOnce.substr(0, parsedOnce.length-5);
    return parsedTwice;
  };

   class Layout extends React.Component {
  	constructor(props){
  		super(props)
  		this.state = {
        speakwith: "",
  			usersonline: [],
  			friendsList: [],
  			currentRoom: "",
  		}
  	}
  	componentDidMount(){
  		socket.on('friendlist', (friends)=>{
  			//not working right now
  			console.log(friends);
  		});
  	};
  	addFriend = (friendUsername, friendUserID) =>{
  		if(!this.props.currentUser.username){
  			return false
  		} else {
        console.log(friendUsername, friendUserID,  this.props.currentUser.userid);
  			socket.emit('addFriend', friendUsername, friendUserID, this.props.currentUser.userid);
  		};
  	};
  	setRoom = (username, userid) =>{
  		if(this.props.currentUser.username && this.props.currentUser.username != username){
  			socket.emit('setRoom', username, userid, this.props.currentUser.userid);
        this.setState({
          speakwith: username,
        });
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
  	        		{this.props.users.map((user) => {
  	        			return <li key={user.UserID}><div onClick={this.setRoom.bind(null, user.Username, user.UserID)}>{user.Username}</div><span onClick={this.addFriend.bind(null, user.Username, user.UserID)}><img src="http://puu.sh/nb58l/ff58ac09fc.png"/></span></li>
     					})}
  	      	</ol>
  					<h4>Friends:</h4>
  	      	</div>
  					{this.props.currentUser.username ? " ": <Loginform/>}
  					<h1>You are: {this.props.currentUser.username}</h1>
  					<div className="messagebox">
              <h3>Dialogue with {this.state.speakwith}</h3>
  						<ol className="messagelist">
  							{this.props.messages.map((message) => {
  								return <li className="messageinstance" key={message.MessageID}>{parseDate(message.MessageDate) + " " + message.Username + ": " + message.MessageValue}</li>;
  							 })}
  						 </ol>
  					</div>
  					{!this.props.currentUser.username && this.props.currentRoom ? " ": <Messages username={this.props.currentUser.username} userID={this.props.currentUser.userID} currrendDiaglogue={this.props.currentRoom} />}
  				</div>
  			</div>
  		)
  	}
  }
  	const test = connect((currentState)=>{
  		return {messages: currentState.messageListReducer, currentRoom: currentState.dialogueReducer, currentUser: currentState.userNameReducer, users: currentState.userlistReducer};
  	});

  export default test(Layout);
