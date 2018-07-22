import React, { Component } from 'react';
import { connect } from 'react-redux';
import database from '../../firebase';
import { setPlayer, setOpponent } from '../../actions';
class Score extends Component {
	componentWillReceiveProps(nextProps) {
		const { lobbyId } = nextProps;
		if (!lobbyId) return;
	}

	componentDidMount() {
		const { lobbyId, players, setPlayer, setOpponent } = this.props;
		if (!lobbyId) return;

		database
			.child('/lobbies')
			.child(lobbyId)
			.on('child_changed', snapshot => {
				if (players.player.name === snapshot.key) {
					setPlayer(snapshot.val());
				} else if (players.opponent.name === snapshot.key) {
					setOpponent(snapshot.val());
				}
			});
	}

	componentWillUnmount() {
		database.child('/lobbies').off('child_changed');
	}

	gameStatus() {
		const { player, opponent } = this.props.players;
		if (player.movesLeft > 0) {
			return '';
		} else if (opponent.movesLeft > 0) {
			return (
				<div className="game-status">
					waiting for opponent to finish game
				</div>
			);
		} else if (opponent.score > player.score) {
			return <div className="game-status">Opponent won the game.</div>;
		} else if (opponent.score === player.score) {
			return <div className="game-status">Draw!</div>;
		} else {
			return <div className="game-status">You won the game.</div>;
		}
	}

	render() {
		if (!this.props.lobbyId) return null;

		return (
			<div className="players">
				{this.gameStatus()}
				<div className="player">
					<p>You</p>
					<p>Score: {this.props.players.player.score}</p>
					<p>Chances: {this.props.players.player.movesLeft}</p>
				</div>
				<div className="opponent">
					<p>Opponent</p>
					<p>Score: {this.props.players.opponent.score}</p>
					<p>Chances: {this.props.players.opponent.movesLeft}</p>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ lobbyId, players }) => ({ lobbyId, players });
const mapDispatchToProps = dispatch => {
	return {
		setOpponent: o => {
			dispatch(setOpponent(o));
		},
		setPlayer: p => {
			dispatch(setPlayer(p));
		}
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Score);
