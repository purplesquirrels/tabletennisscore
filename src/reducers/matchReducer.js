import { notify } from '../socket';

const Mode = {
  VIEW : "view",
  BROADCAST : "broadcast",
  SANDBOX : "sandbox"
}

const config = {
  numserves: 5,
  mode: Mode.VIEW
}

const matches = [];
const history = [];

const newmatch = {
    mode: config.mode,
    numserves: config.numserves,
    firstload: true,
    players: ["", ""],
    results: [],
    scores: [0,0],
    swapped: false,
    initialserve: 0,
    serving: 0,
    history: history,
    matchcode: '12345'
};


const matchReducer = (state = newmatch, action) => {

    const { payload, type } = action;

    switch (type) {

        case "applyState": {
            state = payload.state;
            break;
        }
        case "setMode": {
            state = {
                ...state,
                mode: payload.mode
            };

            notify('send-state', {state: {...state}});
            break;
        }
        case "setMatchCode": {
            state = {
                ...state,
                matchcode: payload.code
            };

            notify('send-state', {state: {...state}});
            break;
        }
        case "startMatch": {
            state = {
                ...state,
                initialserve: payload.firstserver,
                serving: state.initialserve,
                firstload: false
            };

            notify('send-state', {state: {...state}});
            break;
        }
        case "setPlayerName": {

            let players = [...state.players];
            players[payload.player] = payload.value;

            state = {
                ...state,
                players: players
            };

            notify('send-state', {state: {...state}});

            break;
        }
        case "setInitialServe" : {

            state = {
                ...state,
                initialserve: payload.player,
                serving: state.initialserve
            };

            notify('send-state', {state: {...state}});
            break;
        }
        case "addScore" : {

            let scores = [...state.scores];
            scores[payload.player]++;

            state = {
                ...state,
                scores: scores
            };

            if ((state.scores[0] + state.scores[1]) % state.numserves === 0) {
                state.serving = state.serving === 0 ? 1 : 0;
            }

            notify('send-state', {state: {...state}});

            break;
        }
        case "removeScore" : {

            if (state.scores[payload.player] > 0) {

                let wasOnService = (state.scores[0] + state.scores[1]) % config.numserves === 0;
             
                let scores = [...state.scores];
                scores[payload.player]--;

                state = {
                    ...state,
                    scores: scores
                };

                if ((state.scores[0] + state.scores[1]) === 0) {
                    state.serving = state.initialserve;
                }
                else if (wasOnService) {
                    state.serving = state.serving === 0 ? 1 : 0;
                }

            }

            notify('send-state', {state: {...state}});

            break;
        }
        case "undoEndSet" : {
            if (history.length > 0) {

              let s = history.pop();

              state = s;

            }

            notify('send-state', {state: {...state}});
            break;
        }
        case "endSet" : {
            history.push(cloneState(state));

            state = {
                ...state,
                results: [...state.results, [...state.scores]],
                scores: [0, 0],
                swapped: !state.swapped,
                initialserve: state.initialserve === 0 ? 1 : 0,
                serving: state.initialserve
            };

            notify('send-state', {state: {...state}});

            break;
        }
        case "newMatch" : {
            //window.open(window.location);

            matches.push(cloneState(state));
            /*

            state = newState();
            //this.setState(state);
            return state;
            notify('send-state', state);

            */


            break;
        }
        default:
    }
    return state;
};

export default matchReducer;

export function getHistory() {
  return history;
}

export function cloneState(state) {
  return {
    ...state,
    players : [...state.players],
    results : [...state.results],
    scores : [...state.scores]
  };
}

