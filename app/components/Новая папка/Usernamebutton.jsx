import React from 'react'

export default class Usernamebutton extends React.Component {
  render() {
    return <button className="usernamebutton" onClick={this.props.onClick}>Send name</button>
  }
}