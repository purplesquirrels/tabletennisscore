import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import { Router, Route, browserHistory } from 'react-router';
import App from './App';
import AppViewOnly from './AppViewOnly';
import SetupMatch from './components/SetupMatch';
import Error404 from './components/Error404';
import './index.css';

import store from "./store/store";
import Socket from './socket';

Socket.setupSocket();

ReactDOM.render(
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={SetupMatch} />
			<Route path="/view" component={AppViewOnly} />
			<Route path="/broadcast" component={App} />
			<Route path="/sandbox" component={App} />
			<Route path="*" component={Error404}/>
		</Router>
	</Provider>,
	document.getElementById('root')
);
