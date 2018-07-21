import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
// for redux development tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	connectRouter(history)(rootReducer),
	{},
	composeEnhancers(applyMiddleware(routerMiddleware(history)))
);

export { store, history };
