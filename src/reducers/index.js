import { combineReducers } from 'redux';
import lobbyId from './lobby';
import players from './players';

export default combineReducers({
	lobbyId,
	players
});
