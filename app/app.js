import React from 'react'
import { render } from 'react-dom'
import Layout from './components/Layout.jsx'
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
var socket = io();


const reducer = (currentState = " ", action) =>{
	switch (action.type){
		case 'CREATEDIAGLOE':
				console.log('started dialogue with: ', currentState);
			return currentState = action.userinstance;
		default:
			return currentState;
	}
};

const store = createStore(reducer);

socket.on('startSingleConversationSendBack', (userinstance) =>{
	store.dispatch({type: 'CREATEDIAGLOE', userinstance});
});

render(<Provider store={store} ><Layout store={store}/></Provider>, document.getElementById('root'))
export default connect()(Layout)
