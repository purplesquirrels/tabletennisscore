import React, { Component } from 'react';
import {connect} from "react-redux";
import * as Actions from "../actions/matchActions";
//import classnames from 'classnames';
import './SetupMatch.css';


class SetupMatch extends Component {

  render() {

    const { players, router } = this.props;

    //console.log(this.props);
  
    const disablestart = players[0] === "" || players[1] === "";

    return (<div className="firstload">
      <h1>New match</h1>
      <p>Enter player names</p>
      <div className="name-input">
        <input type="text" value={players[0]} onChange={(e) => this.props.setPlayerName(0, e.currentTarget.value)} placeholder="Player 1" />
        <input type="text" value={players[1]} onChange={(e) => this.props.setPlayerName(1, e.currentTarget.value)} placeholder="Player 2" />
      </div>
      <p>Choose who is serving first to start match</p>
      <div className="serve-select">
        <button disabled={disablestart} onClick={() => {this.props.setMode('broadcast');this.props.startMatch(0);router.push('/broadcast')}}>{players[0] || "Enter a player 1 name"}</button>
        <button disabled={disablestart} onClick={() => {this.props.setMode('broadcast');this.props.startMatch(1);router.push('/broadcast')}}>{players[1] || "Enter a player 2 name"}</button>
      </div>
      <div className="matchcode">Match code: {this.props.matchcode}</div>
    </div>)

  }
}

const mapStateToProps = (state) => {

  return {
      matchcode: state.matchdata.matchcode,
      players: state.matchdata.matches[state.matchdata.currentmatch].sets[0].players//,
      //history: state.history
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPlayerName: (player, value) =>  dispatch(Actions.setPlayerName(player, value)),
        setMode: (mode) =>  dispatch(Actions.setMode(mode)),
        startMatch: (firstserver) =>  dispatch(Actions.startMatch(firstserver)),
        //setInitialServe: (player) =>  dispatch(Actions.setInitialServe(player)),
        //addScore: (player) =>  dispatch(Actions.addScore(player)),
        //removeScore: (player) =>  dispatch(Actions.removeScore(player)),
        //undoEndSet: () =>  dispatch(Actions.undoEndSet()),
        //endSet: () =>  dispatch(Actions.endSet()),
        //newMatch: () =>  dispatch(Actions.newMatch())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetupMatch);
