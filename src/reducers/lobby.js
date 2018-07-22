import { actionTypes } from '../constants';

const lobbyId = (state = null, action) => {
	switch (action.type) {
		case actionTypes.SET_LOBBY_ID:
			return action.id;
		case actionTypes.RESET_GAME:
			return null;
		default:
			return state;
	}
};

export default lobbyId;
