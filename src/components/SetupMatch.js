import React, { Component } from 'react';
import {connect} from "react-redux";
import * as Actions from "../actions/matchActions";
//import classnames from 'classnames';
import './SetupMatch.css';
import { MatchType } from '../constants/MatchType';


class SetupMatch extends Component {

  constructor(props) {
    super(props);
    
    this.getPlayerInputs = this.getPlayerInputs.bind(this);
    this.swapNames = this.swapNames.bind(this);
  }

  swapNames() {
    var p1 = this.props.players[0];
    var p2 = this.props.players[1];
    
    this.props.setPlayerName(0, p2);
    this.props.setPlayerName(1, p1);
  }

  getPlayerInputs(matchtype, players) {

    switch (matchtype) {
      case MatchType.SINGLES :
        return (<div className="name-input">
                  <input type="text" value={players[0]} onChange={(e) => this.props.setPlayerName(0, e.currentTarget.value)} placeholder="Player 1" />
                  <input type="text" value={players[1]} onChange={(e) => this.props.setPlayerName(1, e.currentTarget.value)} placeholder="Player 2" />
                  <button onClick={this.swapNames}>&lt;-&gt;</button>
                </div>); 
      case MatchType.DOUBLES : 
        return (<div className="name-input">
                  <div className="team-group">
                    <input type="text" value={players[1]} onChange={(e) => this.props.setPlayerName(1, e.currentTarget.value)} placeholder="Team A player 2" />
                    <input type="text" value={players[0]} onChange={(e) => this.props.setPlayerName(0, e.currentTarget.value)} placeholder="Team A player 1" />
                  </div>
                  <div className="team-group">
                    <input type="text" value={players[2]} onChange={(e) => this.props.setPlayerName(2, e.currentTarget.value)} placeholder="Team B player 1" />
                    <input type="text" value={players[3]} onChange={(e) => this.props.setPlayerName(3, e.currentTarget.value)} placeholder="Team B player 2" />
                  </div>
                </div>); 
      default:
    }

  }

  render() {

    const { players, router, mode, matchtype } = this.props;

    //console.log(this.props);

    let disablestart = true;

    if (matchtype === MatchType.SINGLES) {
      disablestart = !players[0] || !players[1];
    }
    else {
      disablestart = !players[0] || !players[1] || !players[2] || !players[3];
    }

    return (<div className="firstload">
      <h1 className="app-title">New match</h1>
      <div className="match-input">
      <input id="mtcsng" className="matchtype matchtype-singles" type="radio" name="matchtype" onChange={() => this.props.setMatchType(MatchType.SINGLES)} value={MatchType.SINGLES} checked={matchtype===MatchType.SINGLES} />
      <label htmlFor={"mtcsng"}>Singles</label>
      <input id="mtcdbl" className="matchtype matchtype-doubles" type="radio" name="matchtype" onChange={() => this.props.setMatchType(MatchType.DOUBLES)} value={MatchType.DOUBLES} checked={matchtype===MatchType.DOUBLES} />
      <label htmlFor={"mtcdbl"}>Doubles</label>
      </div>
      {matchtype === MatchType.SINGLES ?
        <p>Enter player names</p>
        :
        [<p key={0}>Enter teams</p>,
         <div key={1} className="team-titles">
          <h3 className="title">Team A</h3>
          <h3 className="title">Team B</h3>
         </div>
        ]
      }
      {this.getPlayerInputs(matchtype, players)}
      <p>Choose who is serving first to start match</p>
      {matchtype === MatchType.SINGLES ?
        <div className="serve-select">
          <button disabled={disablestart} onClick={() => {this.props.startMatch(0);router.push(mode)}}>{players[0] || "Enter a player 1 name"}</button>
          <button disabled={disablestart} onClick={() => {this.props.startMatch(1);router.push(mode)}}>{players[1] || "Enter a player 2 name"}</button>
        </div>
        :
        <div className="serve-select">
          <button disabled={disablestart} onClick={() => {this.props.startMatch(0);router.push(mode)}}>{"Team A"}</button>
          <button disabled={disablestart} onClick={() => {this.props.startMatch(2);router.push(mode)}}>{"Team B"}</button>
        </div>
      }
      {(mode === "broadcast" && <div className="matchcode">Match code: {this.props.matchcode}</div>)}
    </div>)

  }
}

const mapStateToProps = (state) => {

  return {
      mode: state.matchdata.mode,
      matchtype: state.matchdata.matchtype,
      matchcode: state.matchdata.matchcode,
      players: state.matchdata.matches[state.matchdata.currentmatch].sets[0].players//,
      //history: state.history
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPlayerName: (player, value) =>  dispatch(Actions.setPlayerName(player, value)),
        setMode: (mode) =>  dispatch(Actions.setMode(mode)),
        setMatchType: (matchtype) =>  dispatch(Actions.setMatchType(matchtype)),
        startMatch: (firstserver) =>  dispatch(Actions.startMatch(firstserver))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetupMatch);
