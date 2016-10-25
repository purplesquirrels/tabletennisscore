import React from 'react';
import classnames from 'classnames';
import './PlayerCard.css';

const PlayerCard = (props) => {
	return 	(<div className={classnames({...props.classes, "player":true})} onClick={props.onAddScore}>
				<div className={"playername"}>{props.playername}</div>
				{props.scores}
				<button className="removescore" onClick={(e) => {e.stopPropagation();props.onRemoveScore()}}>-</button>
			</div>)
}

export default PlayerCard;