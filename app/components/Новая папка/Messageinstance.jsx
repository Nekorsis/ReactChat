import React from 'react'

export default class Messageinstance extends React.Component {
	render(){
		return <p className="messageinstance" value={this.props.text} />;
	}
}