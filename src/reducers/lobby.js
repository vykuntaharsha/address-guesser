import { actionTypes } from '../constants';

const lobbyId = (state = null, action) => {
	switch (action.type) {
		case actionTypes.SET_LOBBY_ID:
			return action.id;
		default:
			return state;
	}
};

export default lobbyId;
