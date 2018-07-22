import React, { Component } from 'react';
import { connect } from 'react-redux';
import database from '../../firebase';
import { history } from '../../store.js';
import { setLobbyId, setPlayer } from '../../actions';
import { players } from '../../constants';
import './home.css';

class Home extends Component {
	state = {
		join: false,
		error: null
	};
	inputRef = React.createRef();

	handleCreateLobby = () => {
		const lobbiesRef = database.child('lobbies');
		const player1 = players.PLAYER1;
		const lobby = lobbiesRef.push({
			player1: { score: 0, movesLeft: 5 }
		});

		this.props.setLobbyId(lobby.key);
		this.props.setPlayer(player1);
		history.push('game');
	};

	handleJoinLobby = () => {
		this.setState({
			join: true
		});
	};

	handleInput = e => {
		if (e.key === 'Enter') {
			this.handleGo();
		}
	};

	handleCancel = () => {
		this.setState({
			join: false,
			error: null
		});
	};

	setError = error => {
		this.setState({ error }, () => {
			setTimeout(() => {
				this.setState({ error: null });
			}, 1000);
		});
	};

	handleGo = () => {
		const lobbyId = this.inputRef.current.value;
		if (!lobbyId) return this.setError('Enter a valid Lobby id');

		const { setLobbyId, setPlayer } = this.props;
		database
			.child('/lobbies')
			.child(lobbyId)
			.once('value', snapshot => {
				if (snapshot.val()) {
					if (snapshot.val().player2) {
						return this.setError('Lobby is full');
					}
					const player2 = players.PLAYER2;
					database
						.child('/lobbies')
						.child(lobbyId)
						.child(player2)
						.set({ score: 0, movesLeft: 4 });
					setLobbyId(lobbyId);
					setPlayer(players.PLAYER2);
					history.push('game');
				} else {
					this.setError('Not a valid lobby id');
				}
			});
	};

	render() {
		return (
			<main className="home">
				{!this.state.join ? (
					<div className="lobby-buttons">
						<button
							onClick={this.handleCreateLobby}
							className="create-lobby-btn">
							Create Lobby
						</button>
						<button
							onClick={this.handleJoinLobby}
							className="join-lobby-btn">
							Join Lobby
						</button>
					</div>
				) : (
					''
				)}
				{this.state.join ? (
					<div className="join-section">
						{this.state.error ? (
							<Error error={this.state.error} />
						) : (
							''
						)}
						<input
							placeholder="Enter Lobby id"
							ref={this.inputRef}
							className="join-input"
							onChange={this.handleInput}
							required
						/>
						<div className="join-buttons">
							<button
								className="cancel-join-btn"
								onClick={this.handleCancel}>
								Cancel
							</button>
							<button
								className="go-join-btn"
								onClick={this.handleGo}>
								Go
							</button>
						</div>
					</div>
				) : (
					''
				)}
			</main>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	setLobbyId: id => {
		dispatch(setLobbyId(id));
	},
	setPlayer: p => {
		dispatch(setPlayer(p));
	}
});

export default connect(
	null,
	mapDispatchToProps
)(Home);

class Error extends Component {
	state = {
		delete: false
	};

	componentDidMount() {
		setTimeout(() => {
			this.setState({ delete: true });
		}, 2000);
	}

	render() {
		if (this.state.delete) return null;
		return <span className="error">{this.props.error}</span>;
	}
}
