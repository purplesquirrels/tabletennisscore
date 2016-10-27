import React from 'react';
import classnames from 'classnames';
import Icon from './Icon';
import './PlayerCard.css';

const PlayerCard = (props) => {
	return 	(<div className={classnames({...props.classes, "player":true})} onClick={props.onAddScore}>
				<div className={"playername"}>{props.playername}</div>
				{props.scores}
				{props.subtract && <button className="removescore" onClick={(e) => {e.stopPropagation();props.onRemoveScore()}}><Icon icon="remove"/></button>}
			</div>)
}

export default PlayerCard;