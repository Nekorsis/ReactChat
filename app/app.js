	import React from 'react'
	import { render } from 'react-dom'
	import Layout from './components/Layout.jsx'
	import { createStore } from 'redux';
	import { connect } from 'react-redux';
	import { Provider } from 'react-redux';
	import { combineReducers } from 'redux'
	const socket = io();

	const dialogueReducer = (currentState = ' ', action) => {
  switch (action.type) {
    case 'STARTDIALOGUE':
      return currentState + action.userinstance;
    default:
				return currentState;
		}
	};
	const userNameReducer = (currentUser = {}, action) =>{
		switch (action.type) {
			case 'SETUSERNAME':
				return currentUser = action.user;
			default:
				return currentUser;
		}
	};
	const messageListReducer = (currentMessages = [], action) =>{
		switch (action.type) {
			case 'LOADHISTORY':
				return currentMessages = action.result;
			case 'ADDMESSAGE':
				return [...currentMessages, action.messageinstance];
			default:
				return currentMessages;
		}
	};
	const userlistReducer = (currentUsers = [], action) =>{
		switch (action.type) {
			case 'USERLIST':
				return currentUsers = action.usernames;
			default:
				return currentUsers;
		}
	};
	const reducer = combineReducers({
		userlistReducer,
		dialogueReducer,
		userNameReducer,
		messageListReducer
	});
	const store = createStore(reducer);

	socket.on('userlist', usernames => {
		store.dispatch({type: 'USERLIST', usernames});
	});

	socket.on('overlap', () =>{
		alert('this username is already in use');
	});

	socket.on('history', (result)=>{
		store.dispatch({type: 'LOADHISTORY', result})
	});

	socket.on('userset', (user)=>{
		store.dispatch({type: 'SETUSERNAME', user });
	});

	socket.on('msg sendback', (messageinstance)=>{
		store.dispatch({type: 'ADDMESSAGE', messageinstance});
	});
	socket.on('startSingleConversationSendBack', (userinstance) =>{
		store.dispatch({type: 'CREATEDIAGLOE', userinstance});
	});

	render(<Provider store={store} ><Layout store={store}/></Provider>, document.getElementById('root'))
	export default connect()(Layout)
