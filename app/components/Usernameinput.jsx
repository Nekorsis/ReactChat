import React from 'react'

export default class Usernameinput extends React.Component {
	render() {
		return <input className="usernameinput" type="text" onChange={this.props.onChange} value={this.props.text} />
	}
}
