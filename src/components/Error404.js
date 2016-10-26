import React from 'react';
import classnames from 'classnames';
import './Error404.css';

const Error404 = (props) => {
	return 	(<div className={classnames({...props.classes, "error404":true})}>
				<p>404 Error: Page not found.</p>
			</div>)
}

export default Error404;