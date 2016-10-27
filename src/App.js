import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerCard from './components/PlayerCard';
import Icon from './components/Icon';
import * as Actions from "./actions/matchActions";
import classnames from 'classnames';
import './App.css';
/*

const io = require('socket.io-client');
let socket;*/



class App extends Component {

  constructor(props) {
    super(props);

    this.getSetScores = this.getSetScores.bind(this);

  }

  getSetScores(sets) {

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

      return <div key={i} className={classes}>{item.scores[0] > item.scores[1] ? item.players[0] : item.players[1]}<br/>{item.scores.join(" - ")}</div>
    });

    results.shift(); // remove the current game

    if (results.length) return results;

    return <div key="empty" className="firstset">First set</div>;
  }

  render() {

    const { state, sets } = this.props;

    const firstgame = state.scores[0] + state.scores[1] === 0 && sets.length > 1;


    let player1classes = {
      "player1" : true,
      "serving" : state.serving === 0,
    };

    let player2classes = {
      "player2" : true,
      "serving" : state.serving === 1
    };

    let appscoreclasses = classnames({
      "App-score" : true,
      "swapends" : state.swapped
    });

    let players = [
      <PlayerCard 
        key={0}
        playername={state.players[0]}
        scores={state.scores[0]}
        classes={player1classes}
        subtract={true}
        onAddScore={() => this.props.addScore(0)}
        onRemoveScore={(e) => this.props.removeScore(0)} />,
      <PlayerCard 
        key={1}
        playername={state.players[1]}
        scores={state.scores[1]}
        classes={player2classes}
        subtract={true}
        onAddScore={() => this.props.addScore(1)}
        onRemoveScore={(e) => this.props.removeScore(1)} />
      
    ];

    return (
      <div className="App">
        <div className="App-results">
          {this.getSetScores(sets)}
          <button className="newmatch" onClick={() => {this.props.newMatch(); this.props.router.push('/')}}>New</button>
          <div className="score-matchcode">{this.props.matchcode}</div>
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
        newMatch: () =>  dispatch(Actions.newMatch())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);