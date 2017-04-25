import React from 'react';
import classnames from 'classnames';

const PlayerCardView = (props) => {
	let names = [<div key={0} className={"view-playername view-player-a"}>{props.playername[0]}</div>];

	if (props.playername[1]) {
		names.push(<div key={1} className={"view-playername view-player-b"}>{props.playername[1]}</div>)
	}

	return (<div className={classnames({ ...props.classes, "view-player": true })}>
		<div className="sets">{props.setcount}</div>
		<div className="score-value">{props.scores}</div>
		{names}
		{props.serving && <div className="serving-message">Serving</div>}
	</div>)
}

export default PlayerCardView;