import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerCard from './components/PlayerCard';
import Icon from './components/Icon';
import classnames from 'classnames';
import './AppViewOnly.css';
import { setMatchCode } from './actions/matchActions';
import { notify } from './socket';

class AppViewOnly extends Component {

  constructor(props) {
    super(props);

    this.connectToGame = this.connectToGame.bind(this);
    this.getSetScores = this.getSetScores.bind(this);
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
    notify('join-match', {code: this.state.matchcode, room: this.state.matchcode});
  }

  getSetScores(sets) {

    let count = [0, 0];

    if (sets.length > 1){
      sets.forEach((item, index) => {
        if (index > 0) count[item.scores[0] > item.scores[1] ? 0 : 1]++;
      });
    }

    let classes = classnames({
      "result" : true
    });

    let results = [
      <div key={0} className={classes}><span className="name">{sets[0].players[0]}</span>{count[0]}</div>,
      <div key={1} className={classes}><span className="name">{sets[0].players[1]}</span>{count[1]}</div>
    ];

    if (this.props.state.swapped) results.reverse();

    return results;
  }

  getPastMatches(matches) {

    if (matches.length <= 1) return null;

    let m = [];

    matches.forEach((match, index) => {
        if (index === 0) return;

        let sets = match.sets;

        let p1 = [];
        let p2 = [];

        sets.forEach((item, index) => {
          p1.push(<td className={"past-score" + (item.scores[0] > item.scores[1] ? " winner" : "")} key={"1"+index}>{item.scores[0]} </td>);
          p2.push(<td className={"past-score" + (item.scores[1] > item.scores[0] ? " winner" : "")} key={"2"+index}>{item.scores[1]} </td>);
        });

        p1.reverse().push(<td key={"a1"}>{sets[0].players[0]} </td>)
        p2.reverse().push(<td key={"a2"}>{sets[0].players[1]} </td>)
      

        m.push(<div><h2>Match {matches.length - index}</h2><table key={index}>
          <tr>{p1.reverse()}</tr>
          <tr>{p2.reverse()}</tr>
        </table></div>);

    });

    return (<div className="past-matches">{m}</div>)
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

    const pastmatches = this.getPastMatches(this.props.matches);

    return (
      <div className={"App viewonly " + (!!pastmatches ? "has-past-matches" : "")}>
        {pastmatches}
        <div className="App-results">
          <div className="view-matchcode">{this.props.matchcode}</div>
          {this.getSetScores(sets)}
        </div>
        <div className={appscoreclasses}>
          {players}
          <button className="mirror" onClick={(e) => this.setState({mirror:!this.state.mirror})}><Icon icon='swap'/></button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      matchcode: state.matchdata.matchcode,
      sets: state.matchdata.matches[state.matchdata.currentmatch].sets,
      state: state.matchdata.matches[state.matchdata.currentmatch].sets[0],
      matches: state.matchdata.matches
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      setMatchCode: (value) =>  dispatch(setMatchCode(value))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppViewOnly);