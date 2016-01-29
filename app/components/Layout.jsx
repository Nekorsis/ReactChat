import React from 'react'
import Messagelistparent from './Messagelistparent.jsx'
import Messageparent from './Messageparent.jsx'
import Usernameparent from './Usernameparent.jsx'
import Storage from './Storage.jsx'
var socket = io()

export default class Layout extends React.Component {
	render() {
		return (
			<div>
				<Storage />
			</div>
		)
	}
}
