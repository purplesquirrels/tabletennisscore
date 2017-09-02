import React, { Component } from 'react';
import { connect } from "react-redux";
import PlayerCardView from './PlayerCardView';
import Timer from './Timer';
import Icon from './Icon';
import classnames from 'classnames';
import './ScoreView.css';
import { setMatchCode } from '../actions/matchActions';
import { notify } from '../socket';
import { MatchType } from '../constants/MatchType';

class ScoreView extends Component {

	constructor(props) {
		super(props);

		this.connectToGame = this.connectToGame.bind(this);
		this.getSetScores = this.getSetScores.bind(this);
		this.getSetScoresRaw = this.getSetScoresRaw.bind(this);
		this.getPastMatches = this.getPastMatches.bind(this);

		this.state = {
			mirror: false,
			isConnected: false,
			matchcode: ""
		}

	}

	connectToGame(e) {

		e.preventDefault();

		this.props.setMatchCode(this.state.matchcode);

		this.setState({
			isConnected: true
		});
		//setMatchCode()
		notify('join-match', { code: this.state.matchcode, room: this.state.matchcode });
	}

	getSetScoresRaw(matchtype, sets) {
		let count = [0, 0];

		if (sets.length > 1) {
			sets.forEach((item, index) => {
				if (index > 0) count[item.scores[0] > item.scores[1] ? 0 : 1]++;
			});
		}

		return count;
	}
	getSetScores(matchtype, sets) {

		let count = [0, 0];

		if (sets.length > 1) {
			sets.forEach((item, index) => {
				if (index > 0) count[item.scores[0] > item.scores[1] ? 0 : 1]++;
			});
		}

		let classes = classnames({
			"set": true
			// "result" : true
		});

		/*let results = [
		  <div key={0} className={classes}><span className="name">{sets[0].players[0]}</span>{count[0]}</div>,
		  <div key={1} className={classes}><span className="name">{sets[0].players[1]}</span>{count[1]}</div>
		];*/

		let results = [];

		switch (matchtype) {
			case MatchType.SINGLES:
				results = [
					<div key={0} className={classes}><span className="name">{sets[0].players[0]}</span>{count[0]}</div>,
					<div key={1} className={classes}><span className="name">{sets[0].players[1]}</span>{count[1]}</div>
				];
				break;
			case MatchType.DOUBLES:
				results = [
					<div key={0} className={classes}><span className="name">{`${sets[0].players[0] || "-"}/${sets[0].players[1] || "-"}`}</span>{count[0]}</div>,
					<div key={1} className={classes}><span className="name">{`${sets[0].players[2] || "-"}/${sets[0].players[3] || "-"}`}</span>{count[1]}</div>
				];
				break;
			default:
		}

		if (this.props.state.swapends) results.reverse();

		return results;
	}

	getPastMatches(matches) {

		if (matches.length <= 1) return <div className="past-matches"><h1>Previous matches</h1><p className="empty-message">No other matches played</p></div>;

		let m = [];

		matches.forEach((match, index) => {
			if (index === 0) return;

			let sets = match.sets;

			let p1 = [];
			let p2 = [];

			sets.forEach((item, index) => {
				if (!item.scores[0] && !item.scores[1]) return;
				p1.push(<td className={"past-score" + (item.scores[0] > item.scores[1] ? " winner" : "")} key={"1" + index}>{item.scores[0]}</td>);
				p2.push(<td className={"past-score" + (item.scores[1] > item.scores[0] ? " winner" : "")} key={"2" + index}>{item.scores[1]}</td>);
			});

			if (!p1.length && !p2.length) return;

			if (p1.length === 2) p1.unshift(<td className={"past-score"} key={"1bl"}>-</td>);
			if (p2.length === 2) p2.unshift(<td className={"past-score"} key={"2bl"}>-</td>);

			p1.push(<td key={"a1"}>{sets[0].players[0]} </td>)
			p2.push(<td key={"a2"}>{sets[0].players[1]} </td>)


			m.push(<div key={index}><h2>Match {matches.length - index}</h2><table><tbody>
				<tr>{p1.reverse()}</tr>
				<tr>{p2.reverse()}</tr>
			</tbody></table></div>);

		});

		return (<div className="past-matches"><h1>Previous matches</h1>{m}</div>)
	}

	render() {

		const { state, sets, matchtype, matches } = this.props;


		if (!this.state.isConnected) {

			return (<div className="entercode">
				<h1>Connect to a game</h1>
				<form className="code-input">
					<input type="text" value={this.state.matchcode} onChange={(e) => this.setState({ matchcode: e.currentTarget.value })} placeholder="Enter match code" />
					<button type="submit" className="connect-to-game" onClick={this.connectToGame}>Connect</button>
				</form>
			</div>)
		}


		let player1classes = {
			"player1": true,
			"player-left": state.swapends ? false : true,
			"player-right": state.swapends ? true : false,
			"swapped": state.playerswap[0],
			//"serving" : matchtype === "singles" ? state.serving === 0 : state.serving === 0 || state.serving === 1
		};

		let player2classes = {
			"player2": true,
			"player-left": state.swapends ? true : false,
			"player-right": state.swapends ? false : true,
			"swapped": state.playerswap[1],
			//"serving" : matchtype === "singles" ? state.serving === 1 : state.serving === 2 || state.serving === 3
		};


		let appscoreclasses = classnames({
			"App-scores": true,
			"swapends": state.swapends,
			"mirrored": this.state.mirror,
			"doubles": matchtype === "doubles",
			"singles": matchtype === "singles"
		});


		let playernames1 = matchtype === "doubles" ? [state.players[0] || "Player 1", state.players[1] || "Player 2"] : [state.players[0] || "Player 1"];
		let playernames2 = matchtype === "doubles" ? [state.players[2] || "Player 3", state.players[3] || "Player 4"] : [state.players[1] || "Player 2"];


		//const pastmatches = this.getPastMatches(matches);
		const setresults = this.getSetScoresRaw(matchtype, sets);

		let player1serving = matches[0].started && (matchtype === "singles" ? state.serving === 0 : state.serving === 0 || state.serving === 1);
		let player2serving = matches[0].started && (matchtype === "singles" ? state.serving === 1 : state.serving === 2 || state.serving === 3);

		let players = [
			<PlayerCardView
				key={0}
				playername={playernames1}
				swapends={state.swapends}
				scores={state.scores[0]}
				setcount={setresults[0]}
				serving={player1serving}
				classes={player1classes}
				onAddScore={() => { }}
				onRemoveScore={(e) => { }} />,
			<PlayerCardView
				key={1}
				playername={playernames2}
				swapends={state.swapends}
				scores={state.scores[1]}
				setcount={setresults[1]}
				serving={player2serving}
				classes={player2classes}
				onAddScore={() => { }}
				onRemoveScore={(e) => { }} />

		];


		return (<div className="scorer viewonly">
			<Timer starttime={this.props.starttime} />
			<div className={appscoreclasses}>
				{players}
				<div className="divider"></div>
				<button className="mirror" onClick={(e) => this.setState({ mirror: !this.state.mirror })}><Icon icon='swaphoriz' /></button>
			</div>
		</div>);



		/*
			return (
			  <div className={"App viewonly " + (!!pastmatches ? "has-past-matches" : "")}>
			    
				<div className="App-results">
				  <div className="view-matchcode">{this.props.matchcode}</div>
				  {this.getSetScores(matchtype, sets)}
				</div>
				<div className={appscoreclasses}>
				  {players}
				  <button className="mirror" onClick={(e) => this.setState({mirror:!this.state.mirror})}><Icon icon='swaphoriz'/></button>
				</div>
			  </div>
			);*/
	}
}

const mapStateToProps = (state) => {
	return {
		matchcode: state.matchdata.matchcode,
		matchtype: state.matchdata.matchtype,
		starttime: state.matchdata.matches[state.matchdata.currentmatch].time,
		sets: state.matchdata.matches[state.matchdata.currentmatch].sets,
		state: state.matchdata.matches[state.matchdata.currentmatch].sets[0],
		matches: state.matchdata.matches
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setMatchCode: (value) => dispatch(setMatchCode(value))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ScoreView);