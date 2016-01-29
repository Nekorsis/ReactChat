import React from 'react'
import Usernameinput from './Usernameinput.jsx'
import Usernamebutton from './Usernamebutton.jsx'

export default class Usernameparent extends React.Component {


render() {
		return (
				<div>
					<Usernameinput/>
					<Usernamebutton/>
				</div>
			)
	};
}
	