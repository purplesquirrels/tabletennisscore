import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './App';
import Home from './components/Home';
import Scorer from './components/Scorer';
import ScoreView from './components/ScoreView';
import SetupMatch from './components/SetupMatch';
import Error404 from './components/Error404';
import './index.css';

import store from "./store/store";
import Socket from './socket';

Socket.setupSocket();

function checkForMatch(nextState, replace) {

	//var state = store.getState().matchdata.matches[0].started;
	
	if (!store.getState().matchdata.matches[0].started) {
		replace("/")
	}
}

ReactDOM.render(
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Home} />
				<Route path="start" component={SetupMatch} />
				<Route path="broadcast" component={Scorer} onEnter={checkForMatch} />
				<Route path="sandbox" component={Scorer} onEnter={checkForMatch} />
				<Route path="view" component={ScoreView} />
			</Route>
			<Route path="*" component={Error404} />
		</Router>
	</Provider>,
	document.getElementById('root')
);
