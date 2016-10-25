import React, { Component } from 'react';
import classnames from 'classnames';
import './App.css';

const config = {
  numserves: 5
}

let state = {
  firstload: true,
  players: ["", ""],
  results: [],
  scores: [0,0],
  swapped: false,
  initialserve: 0,
  serving: 0
}

class App extends Component {

  constructor(props) {
    super(props);
    this.startMatch = this.startMatch.bind(this);
    this.getSetScores = this.getSetScores.bind(this);
    this.addScore = this.addScore.bind(this);
    this.removeScore = this.removeScore.bind(this);
    this.endSet = this.endSet.bind(this);
    this.newMatch = this.newMatch.bind(this);

    this.state = state;
  }

  startMatch(firstserver) {
    state.initialserve = firstserver;
    state.serving = state.initialserve;
    state.firstload = false;
    this.setState(state);
  }

  setPlayerName(player, value) {
    state.players[player] = value;
    this.setState(state);
  }

  setInitialServe(player) {

    state.initialserve = player;
    state.serving = state.initialserve;

    this.setState(state);
  }

  removeScore(player) {

    if (state.scores[player] > 0) {

      state.scores[player]--;

      if ((state.scores[0] + state.scores[1]) === 0) {
        state.serving = state.initialserve;
      }
      else if ((state.scores[0] + state.scores[1]) % config.numserves === 0) {
        state.serving = state.serving === 0 ? 1 : 0;
      }

      this.setState(state);
  }
  }
  addScore(player) {
    state.scores[player]++;

    if ((state.scores[0] + state.scores[1]) % config.numserves === 0) {
      state.serving = state.serving === 0 ? 1 : 0;
    }

    this.setState(state);


  }

  endSet() {

    if (confirm("End the set?")) {
      state.results.push([...state.scores]);
      state.scores = [0, 0];
      state.swapped = !state.swapped;
      state.initialserve = state.initialserve === 0 ? 1 : 0;
      state.serving = state.initialserve;

      this.setState(state);
   }
  }

  newMatch() {
    window.open(window.location);
  }

  getSetScores() {

    let count = [0, 0];

    if (this.state.results.length){
      this.state.results.forEach((item, index, ) => {
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

      return <div key={i} className={classes}>{item[0] > item[1] ? this.state.players[0] : this.state.players[1]}<br/>{item.join(" - ")}</div>
    });
  }

  render() {

    if (this.state.firstload) {

      const disablestart = this.state.players[0] === "" || this.state.players[1] === "";

      return (<div className="firstload">
        <h1>New match</h1>
        <p>Enter player names</p>
        <div className="name-input">
          <input type="text" value={this.state.players[0]} onChange={(e) => this.setPlayerName(0, e.currentTarget.value)} placeholder="Player 1" />
          <input type="text" value={this.state.players[1]} onChange={(e) => this.setPlayerName(1, e.currentTarget.value)} placeholder="Player 2" />
        </div>
        <p>Choose who is serving first to start match</p>
        <div className="serve-select">
          <button disabled={disablestart} onClick={() => this.startMatch(0)}>{this.state.players[0] || "Enter a player 1 name"}</button>
          <button disabled={disablestart} onClick={() => this.startMatch(1)}>{this.state.players[1] || "Enter a player 2 name"}</button>
        </div>
      </div>)
    }


    let player1classes = classnames({
      "player" : true,
      "player1" : true,
      "serving" : this.state.serving === 0,
    });

    let player2classes = classnames({
      "player" : true,
      "player2" : true,
      "serving" : this.state.serving === 1
    });

    let appscoreclasses = classnames({
      "App-score" : true,
      "swapends" : this.state.swapped
    });



    return (
      <div className="App">
        <div className="App-results">
          {this.getSetScores()}
          <button className="newmatch" onClick={this.newMatch}>Open new match</button>
          <button className="endset" onClick={this.endSet}>End set</button>
        </div>
        <div className={appscoreclasses}>
          <div className={player1classes} onClick={() => this.addScore(0)}>
            <div className={"playername"}>{this.state.players[0]}</div>
            {this.state.scores[0]}
            <button className="removescore" onClick={(e) => {e.stopPropagation();this.removeScore(0)}}>-</button>
          </div>
          <div className={player2classes} onClick={() => this.addScore(1)}>
            <div className={"playername"}>{this.state.players[1]}</div>
            {this.state.scores[1]}
            <button className="removescore" onClick={(e) => {e.stopPropagation();this.removeScore(1)}}>-</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
