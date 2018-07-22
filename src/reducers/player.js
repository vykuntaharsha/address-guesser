import { actionTypes } from '../constants';

const player = (state = null, action) => {
	switch (action.type) {
		case actionTypes.SET_PLAYER:
			return action.player;
		default:
			return state;
	}
};

export default player;
