import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setOpponent, resetGame } from '../../actions';
import database from '../../firebase';
import { players as playerConstants } from '../../constants';
import Score from '../Score';
import Map from '../Map';
import './game.css';
import Meeting from '../Meeting';

class Game extends Component {
	state = {
		lobbyFilled: false,
		reset: false
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

	handleLeave = () => {
		database
			.child('/lobbies')
			.child(this.props.lobbyId)
			.off('child_added');
		this.props.resetGame();
	};

	handleScore = diff => {
		const player = this.props.players.player;

		player.score += diff;
		player.movesLeft -= 1;

		database
			.child('/lobbies')
			.child(this.props.lobbyId)
			.child(player.name)
			.set(player);

		this.setState({ reset: true });
		setTimeout(() => {
			this.setState({ reset: false });
		}, 1000);
	};

	render() {
		if (!this.props.lobbyId) return <Redirect to="/" />;
		if (!this.state.lobbyFilled) {
			return (
				<main className="game">
					<Meeting channel={this.props.lobbyId} />
					<div className="lobby-id">
						<button
							onClick={this.handleLeave}
							className="leave-btn">
							Leave
						</button>
						LobbyID: {this.props.lobbyId}
					</div>
					<div className="waiting">waiting for opponent</div>
				</main>
			);
		}

		if (this.props.players.player.movesLeft > 0) {
			return (
				<main className="main">
					<Meeting channel={this.props.lobbyId} />
					<div className="lobby-id">
						<button
							onClick={this.handleLeave}
							className="leave-btn">
							Leave
						</button>LobbyID: {this.props.lobbyId}
					</div>
					<Score />
					<div className="map">
						{this.state.reset ? (
							''
						) : (
							<Map handleScore={this.handleScore} />
						)}
					</div>
				</main>
			);
		} else {
			return (
				<main className="main score">
					<Meeting channel={this.props.lobbyId} />
					<div className="lobby-id">
						<button
							onClick={this.handleLeave}
							className="leave-btn">
							Leave
						</button>LobbyID: {this.props.lobbyId}
					</div>
					<Score />
				</main>
			);
		}
	}
}

const mapStateToProps = ({ lobbyId, players }) => ({ lobbyId, players });

const mapDispatchToProps = dispatch => {
	return {
		setOpponent: o => {
			dispatch(setOpponent(o));
		},
		resetGame: () => {
			dispatch(resetGame());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Game);
