import { combineReducers } from 'redux';
import lobbyId from './lobby';
import player from './player';

export default combineReducers({
	lobbyId,
	player
});
