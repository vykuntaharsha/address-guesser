import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class Game extends Component {
	render() {
		if (!this.props.lobbyId) return <Redirect to="/" />;
		return (
			<main>
				{this.props.lobbyId} {this.props.player}
			</main>
		);
	}
}
const mapStateToProps = ({ lobbyId, player }) => ({ lobbyId, player });

export default connect(mapStateToProps)(Game);
