import React, { Component } from 'react';
import {connect} from "react-redux";
import * as Actions from "../actions/matchActions";
//import classnames from 'classnames';
import './Home.css';


class Home extends Component {

  render() {

    const { router } = this.props;

    //console.log(this.props);
  
    //const disablestart = players[0] === "" || players[1] === "";

    return (<div className="firstload">
      <h1>TT</h1>
      <button onClick={() => {this.props.setMode('sandbox');router.push('start')}}>Score game</button>
      <button onClick={() => {this.props.setMode('broadcast');router.push('start')}}>Broadcast game</button>
      <button onClick={() => {router.push('/view')}}>View game</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
