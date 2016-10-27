import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerCard from './components/PlayerCard';
import classnames from 'classnames';
import './AppViewOnly.css';
import { setMatchCode } from './actions/matchActions';
import { notify } from './socket';

class AppViewOnly extends Component {

  constructor(props) {
    super(props);

    this.connectToGame = this.connectToGame.bind(this);
    this.getSetScores = this.getSetScores.bind(this);

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
    notify('join-match', {code: this.state.matchcode, room: this.state.matchcode});
  }

  getSetScores(sets) {

    let count = [0, 0];

    if (sets.length > 1){
      sets.forEach((item, index, ) => {
        count[item.scores[0] > item.scores[1] ? 0 : 1]++;
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
    results.reverse(); // reverse order

    return results;
  }

  render() {

    const { state, sets } = this.props;

   
    if (!this.state.isConnected) {

      return (<div className="entercode">
        <h1>Connect to a game</h1>
        <form className="code-input">
          <input type="text" value={this.state.matchcode} onChange={(e) => this.setState({matchcode:e.currentTarget.value})} placeholder="Enter match code" />
          <button type="submit" className="connect-to-game" onClick={this.connectToGame}>Connect</button>
        </form>
      </div>)
    }

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
      "swapends" : state.swapped,
      "mirrored" : this.state.mirror
    });

    let players = [
      <PlayerCard 
        key={0}
        playername={state.players[0]}
        scores={state.scores[0]}
        classes={player1classes}
        onAddScore={() => {}}
        onRemoveScore={(e) => {}} />,
      <PlayerCard 
        key={1}
        playername={state.players[1]}
        scores={state.scores[1]}
        classes={player2classes}
        onAddScore={() => {}}
        onRemoveScore={(e) => {}} />
      
    ];


    return (
      <div className="App">
        <div className="App-results">
          <div className="view-matchcode">{this.props.matchcode}</div>
          {this.getSetScores(sets)}
          <button className="mirror" onClick={(e) => this.setState({mirror:!this.state.mirror})}>**</button>
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
      setMatchCode: (value) =>  dispatch(setMatchCode(value))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppViewOnly);