import { actionTypes } from '../constants';

export const setLobbyId = id => ({ type: actionTypes.SET_LOBBY_ID, id });

export const setPlayer = player => ({ type: actionTypes.SET_PLAYER, player });

export const setOpponent = player => ({
	type: actionTypes.SET_OPPONENT,
	player
});
