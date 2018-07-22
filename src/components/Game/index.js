import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setOpponent } from '../../actions';
import database from '../../firebase';
import { players as playerConstants } from '../../constants';

class Game extends Component {
	state = {
		lobbyFilled: false
	};

	componentWillReceiveProps(nextProps) {
		const { lobbyId, players } = nextProps;
		if (!lobbyId) return;
		if (players.opponent) {
			return this.setState({ lobbyFilled: true });
		}
	}

	componentDidMount() {
		const { lobbyId, players, setOpponent } = this.props;
		if (!lobbyId) return;
		if (players.opponent) {
			return this.setState({ lobbyFilled: true });
		}
		database
			.child('/lobbies')
			.child(lobbyId)
			.once('value', snapshot => {
				if (
					snapshot.val() &&
					snapshot.val().player1 &&
					snapshot.val().player2
				) {
					if (players.player.name === playerConstants.PLAYER1) {
						setOpponent({
							name: playerConstants.PLAYER2,
							...snapshot.val().player2
						});
					} else {
						setOpponent({
							name: playerConstants.PLAYER1,
							...snapshot.val().player1
						});
					}
				} else {
					database
						.child('/lobbies')
						.child(lobbyId)
						.on('child_added', data => {
							if (data.key === players.player.name) return;
							if (
								players.player.name === playerConstants.PLAYER1
							) {
								setOpponent({
									name: playerConstants.PLAYER2,
									...data.val()
								});
							} else {
								setOpponent({
									name: playerConstants.PLAYER1,
									...data.val()
								});
							}
						});
				}
			});
	}

	render() {
		if (!this.props.lobbyId) return <Redirect to="/" />;
		if (!this.state.lobbyFilled) {
			return (
				<main>
					<div>{this.props.lobbyId}</div>
					waiting for opponent
				</main>
			);
		}

		return (
			<main>
				{this.props.lobbyId} {this.props.players.player.name}
				{this.props.players.opponent.name}
				<div className="map">Map</div>
			</main>
		);
	}
}
const mapStateToProps = ({ lobbyId, players }) => ({ lobbyId, players });

const mapDispatchToProps = dispatch => {
	return {
		setOpponent: o => {
			dispatch(setOpponent(o));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Game);
