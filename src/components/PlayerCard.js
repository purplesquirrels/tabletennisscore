import React from 'react';
import classnames from 'classnames';
import Icon from './Icon';
import './PlayerCard.css';

const PlayerCard = (props) => {
	let names = [<div key={0} className={"playername player-a"}>{props.playername[0]}</div>];

	if (props.playername[1]) {
		names.push(<div key={1} className={"playername player-b"}>{props.playername[1]}</div>)
	}

	return (<div className={classnames({ ...props.classes, "player": true })} onClick={props.onAddScore}>
		{names}
		{props.scores}
		{props.subtract && <button className="removescore" onClick={(e) => { e.stopPropagation(); props.onRemoveScore() }}><Icon icon="remove" /></button>}
	</div>)
}

export default PlayerCard;