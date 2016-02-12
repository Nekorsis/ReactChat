import React from 'react'

export default class Messagebox extends React.Component {
	render() {
		return (
				<div className='messages'>
					{this.props.children}
				</div>
		)
	}
}
