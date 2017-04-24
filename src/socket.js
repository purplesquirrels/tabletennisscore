import store from './store/store';
import { setMatchCode } from './actions/matchActions';

const io = require('socket.io-client');

//io.set("reconnection limit", 10);

let socket;


export const notify = (message, payload) => {

	var state = store.getState();

	if (socket && (state.matchdata.mode === "broadcast" || message === "join-match")){
      	socket.emit(message, JSON.stringify({...payload, room: state.matchdata.matchcode}));
    }
}

function setupSocket() {
	//socket = io('192.168.1.84:3000');
	socket = io(window.location.host);

	socket.on('connect', function(){
		console.log("connected");
	});

	socket.on('ping', function(data){
    	socket.emit('pong', {pong: 1});
    });

	socket.on('send-match-code', function (data) {
		data = JSON.parse(data);
		store.dispatch(setMatchCode(data.code));
	});

	socket.on('new-state', function (data) {

		let state = store.getState();

		if (state.matchdata.mode === "view") {

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

		let state = store.getState();

		if (state.matchdata.mode === "broadcast") {
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