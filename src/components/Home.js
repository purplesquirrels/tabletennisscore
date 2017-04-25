import React, { Component } from 'react';
import { connect } from "react-redux";
import * as Actions from "../actions/matchActions";
import './Home.css';

class Home extends Component {

	render() {

		const { router } = this.props;

		return (<div className="">
			<h1 className="main-app-title">TT</h1>
			<div className="main-menu">
				<button className="main-menu-button" onClick={() => { this.props.setMode('sandbox'); router.push('start') }}>Score game</button>
				<button className="main-menu-button" onClick={() => { this.props.setMode('broadcast'); router.push('start') }}>Broadcast game</button>
				<button className="main-menu-button" onClick={() => { router.push('/view') }}>View game</button>
			</div>
		</div>)

	}
}

const mapStateToProps = (state) => {

	return {
		matchcode: state.matchdata.matchcode,
		players: state.matchdata.matches[state.matchdata.currentmatch].sets[0].players
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setPlayerName: (player, value) => dispatch(Actions.setPlayerName(player, value)),
		setMode: (mode) => dispatch(Actions.setMode(mode)),
		startMatch: (firstserver) => dispatch(Actions.startMatch(firstserver))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);