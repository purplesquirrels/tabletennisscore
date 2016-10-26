import store from './store/store';
import { setMatchCode } from './actions/matchActions';

const io = require('socket.io-client');

//io.set("reconnection limit", 10);

let socket;


export const notify = (message, payload) => {

	var state = store.getState();

	console.log('notify -> mode', state.match.mode);

	if (socket && (state.match.mode === "broadcast" || message === "join-match")){
		/*if (!payload.room) {
			payload.room = state.match.matchcode;
		}*/

		console.log('notify', message, {...payload, room: state.match.matchcode});

		//socket.broadcast.to(state.match.matchcode).emit(message, JSON.stringify(payload));
      	socket.emit(message, JSON.stringify({...payload, room: state.match.matchcode}));
    }
}

function setupSocket() {
	socket = io('localhost:3000');

	socket.on('connect', function(){
		console.log("connected");

	});
	/*socket.on('connect_error', function(){
		console.log("connect error");

	});
	*/
	socket.on('send-match-code', function (data) {


		data = JSON.parse(data);
		console.log('send-match-code', data);

		store.dispatch(setMatchCode(data.code));

		//socket.join(data.code);
	});

	socket.on('new-state', function (data) {

		console.log('new-state', data);

		let state = store.getState();

		if (state.match.mode === "view") {

			data = JSON.parse(data);
			data.state.mode = "view";

			store.dispatch({
				type: "applyState",
				payload: {
					state: data.state
				}
			})
		}
	});

	socket.on('state-requested', function (data) {

		console.log('state-requested', data);

		let state = store.getState();

		if (state.match.mode === "broadcast") {
		    console.log('state-requested');
		    console.log(data);
		    console.log(store.getState());
		    console.log('---------------');

		    notify('new-state', { state });
		}
	});

	return socket;
}



const Socket = {
	setupSocket, // full capabilities,
	notify,
	getSocket: () => socket
}

export default Socket;