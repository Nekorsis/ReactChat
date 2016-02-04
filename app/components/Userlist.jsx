import React from 'react'


export default class Userlist extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			users: []
		}
	};
	componentDidMount(){
		//socket.on
	}
}
<ol className="msg_list">
        			{this.state.messages.map(function(message) {
         			 	return <li key={message.msgID}>{message.userName + ": " + message.msgVal}</li>;
       				 })}
      			</ol>


      			<ol className="test2">
        				{this.state.Users.map(function(arr) {
         			 		arr.map(function(Obj) {
         			 			console.log("user: ", Obj);
         			 			return <li key={Obj.ID}>{Obj.username}</li>;
         			 		})
       					 })}
      				</ol>