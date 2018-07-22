import { actionTypes } from '../constants';

const players = (state = null, action) => {
	switch (action.type) {
		case actionTypes.SET_PLAYER:
			return {
				...state,
				player: action.player
			};
		case actionTypes.SET_OPPONENT:
			return {
				...state,
				opponent: action.player
			};
		default:
			return state;
	}
};

export default players;
