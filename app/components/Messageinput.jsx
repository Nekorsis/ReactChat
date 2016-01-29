import React from 'react'

export default class Messageinput extends React.Component {
	render() {
		return <input type="text" onChange={this.props.onChange} value={this.props.text} />
	}
}
