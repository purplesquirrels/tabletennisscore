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
      isConnected: false,
      matchcode: ""
    }

  }

  connectToGame() {

    this.props.setMatchCode(this.state.matchcode);

    this.setState({
      isConnected: true
    });
    //setMatchCode()
    notify('join-match', {code: this.state.matchcode, room: this.state.matchcode});
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

    const { state } = this.props;

   
    if (!this.state.isConnected) {

      return (<div className="entercode">
        <p>Enter match code</p>
        <div className="name-input">
          <input type="text" value={this.state.matchcode} onChange={(e) => this.setState({matchcode:e.currentTarget.value})} placeholder="Enter match code" />
          <button className="connect-to-game" onClick={this.connectToGame}>Connect</button>
        </div>
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
      "swapends" : state.swapped
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
          {this.getSetScores(state)}
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
      setMatchCode: (value) =>  dispatch(setMatchCode(value))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppViewOnly);