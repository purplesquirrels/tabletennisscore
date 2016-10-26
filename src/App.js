import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerCard from './components/PlayerCard';
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

  getSetScores(state) {

    let count = [0, 0];

    if (state.results.length){
      state.results.forEach((item, index, ) => {
        count[item[0] > item[1] ? 0 : 1]++;
      });
    }

    let winner = count[0] > count[1] ? 0 : 1;

    return state.results.map((item, i) => {

      let currentwinner = item[0] > item[1] ? 0 : 1;

      let classes = classnames({
        "result" : true,
        "winning" : currentwinner === winner ||  count[0] === count[1]
      });

      return <div key={i} className={classes}>{item[0] > item[1] ? state.players[0] : state.players[1]}<br/>{item.join(" - ")}</div>
    });
  }

  render() {

    const { state, history } = this.props;

    const firstgame = state.scores[0] + state.scores[1] === 0 && history.length > 0;


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
          {this.getSetScores(state)}
          <button className="newmatch" onClick={this.props.newMatch}>Open new match</button>
          {firstgame && <button className="undoendset" onClick={this.props.undoEndSet}>Undo</button>}
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
      state: state.match,
      history: state.match.history
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
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