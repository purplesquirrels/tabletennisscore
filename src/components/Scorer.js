import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerCard from '../components/PlayerCard';
import Icon from '../components/Icon';
import * as Actions from "../actions/matchActions";
import classnames from 'classnames';
import './Scorer.css';
import { MatchType } from '../constants/MatchType';
/*

const io = require('socket.io-client');
let socket;*/



class Scorer extends Component {

  constructor(props) {
    super(props);

    this.getSetScores = this.getSetScores.bind(this);

  }

  getSetScores(matchtype, sets) {

    let count = [0, 0];

    if (sets.length > 1){
      sets.forEach((item, index) => {
        if (index > 0) count[item.scores[0] > item.scores[1] ? 0 : 1]++;
      });
    }

    let winner = count[0] > count[1] ? 0 : 1;

    let results = sets.map((item, i) => {

      let currentwinner = item.scores[0] > item.scores[1] ? 0 : 1;

      let classes = classnames({
        "result" : true,
        "winning" : currentwinner === winner ||  count[0] === count[1]
      });

      switch (matchtype) {
        case MatchType.SINGLES :
          return <div key={i} className={classes}>{item.scores[0] > item.scores[1] ? item.players[0] : item.players[1]}<br/>{item.scores.join(" - ")}</div>;
        case MatchType.DOUBLES :
          return <div key={i} className={classes}>{item.scores[0] > item.scores[1] ? `${item.players[0]}/${item.players[1]}` : `${item.players[2]}/${item.players[3]}`}<br/>{item.scores.join(" - ")}</div>;
        default: return <div key={i} />;
      }
    });

    results.shift(); // remove the current game

    if (results.length) return results;

    return <div key="empty" className="firstset">First set</div>;
  }

  render() {

    const { state, sets, mode, matchtype } = this.props;

    const firstgame = state.scores[0] + state.scores[1] === 0 && sets.length > 1;


    let player1classes = {
      "player1" : true,
      "swapped" : state.playerswap[0],
      "serving" : matchtype === "singles" ? state.serving === 0 : state.serving === 0 || state.serving === 1
    };

    let player2classes = {
      "player2" : true,
      "swapped" : state.playerswap[1],
      "serving" : matchtype === "singles" ? state.serving === 1 : state.serving === 2 || state.serving === 3
    };

    let appscoreclasses = classnames({
      "App-score" : true,
      "swapends" : state.swapends,
      "doubles" : matchtype === "doubles",
      "singles" : matchtype === "singles"
    });

    let playernames1 = matchtype === "doubles" ? [state.players[0], state.players[1]] : [state.players[0]];
    let playernames2 = matchtype === "doubles" ? [state.players[2], state.players[3]] : [state.players[1]];

    let players = [
      <PlayerCard 
        key={0}
        playername={playernames1}
        swapends={state.swapends}
        scores={state.scores[0]}
        classes={player1classes}
        subtract={true}
        onAddScore={() => this.props.addScore(0)}
        onRemoveScore={(e) => this.props.removeScore(0)} />,
      <PlayerCard 
        key={1}
        playername={playernames2}
        swapends={state.swapends}
        scores={state.scores[1]}
        classes={player2classes}
        subtract={true}
        onAddScore={() => this.props.addScore(1)}
        onRemoveScore={(e) => this.props.removeScore(1)} />
      
    ];

    return (
      <div className="App">
        <div className="App-results">
          {this.getSetScores(matchtype, sets)}
          <button className="newmatch" onClick={() => {this.props.newMatch(); this.props.router.push('start')}}>New</button>
          <button className="cancelmatch" onClick={() => {this.props.cancelMatch(); this.props.router.push('start')}}>Cancel</button>
          {mode === "broadcast" && <div className="score-matchcode">{this.props.matchcode}</div>}
          {firstgame && <button className="undoendset" onClick={this.props.undoEndSet}><Icon icon="undo"/></button>}
          <button className="endset" onClick={this.props.endSet}>End set</button>
        </div>
        <div className={appscoreclasses}>
          {players}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      mode: state.matchdata.mode,
      matchtype: state.matchdata.matchtype,
      matchcode: state.matchdata.matchcode,
      sets: state.matchdata.matches[state.matchdata.currentmatch].sets,
      state: state.matchdata.matches[state.matchdata.currentmatch].sets[0]
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentMatch: (match) =>  dispatch(Actions.setCurrentMatch(match)),
        setPlayerName: (player, value) =>  dispatch(Actions.setPlayerName(player, value)),
        startMatch: (firstserver) =>  dispatch(Actions.startMatch(firstserver)),
        setInitialServe: (player) =>  dispatch(Actions.setInitialServe(player)),
        addScore: (player) =>  dispatch(Actions.addScore(player)),
        removeScore: (player) =>  dispatch(Actions.removeScore(player)),
        undoEndSet: () =>  dispatch(Actions.undoEndSet()),
        endSet: () =>  dispatch(Actions.endSet()),
        cancelMatch: () =>  dispatch(Actions.cancelMatch()),
        newMatch: () =>  dispatch(Actions.newMatch())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Scorer);