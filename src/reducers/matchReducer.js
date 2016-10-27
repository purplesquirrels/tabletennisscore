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

//const matches = [];
//const history = [];

const newset = {
   // mode: config.mode,
    //numserves: config.numserves,
    firstload: true,
    players: ["", ""],
    //results: [],
    scores: [0,0],
    swapped: false,
    initialserve: 0,
    serving: 0,
    //history: history,
    //matchcode: '12345'
};

const initialstate = {
    mode: config.mode,
    numserves: config.numserves,
    currentmatch: 0,
    matchcode: '12345',
    matches: [{
        sets: [cloneSet(newset)]
    }]
}


const matchReducer = (state = initialstate, action) => {

    const { payload, type } = action;

    switch (type) {

        case "applyState": {
            state = payload.state;
            break;
        }
        case "setNumServes": {

            state = {
                ...state,
                numserves: payload.numserves
            };

            notify('send-state', {state: {...state}});

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

            let cset = {
                ...state.matches[state.currentmatch].sets[0],
                initialserve: payload.firstserver,
                serving: payload.firstserver,
                firstload: false
            }

            /*state = {
                ...state,
                initialserve: payload.firstserver,
                serving: state.initialserve,
                firstload: false
            };
*/
            state = {
                ...state
            }

            state.matches[state.currentmatch].sets = [...state.matches[state.currentmatch].sets];
            state.matches[state.currentmatch].sets[0] = cset;

            notify('send-state', {state: {...state}});
            break;
        }
        case "setPlayerName": {

            //console.log('setPlayerName', payload.player, payload.value);

            let cset = {
                ...state.matches[state.currentmatch].sets[0],
                initialserve: payload.player,
                serving: state.initialserve
            }

            let players = [...cset.players];
            players[payload.player] = payload.value;
            cset.players = players;

            state = {
                ...state
            }

            state.matches[state.currentmatch].sets = [...state.matches[state.currentmatch].sets];
            state.matches[state.currentmatch].sets[0] = cset;

            notify('send-state', {state: {...state}});

            break;
        }
        case "setInitialServe" : {

            let cset = {
                ...state.matches[state.currentmatch].sets[0],
                initialserve: payload.player,
                serving: state.initialserve
            }

            /*state = {
                ...state,
                initialserve: payload.player,
                serving: state.initialserve
            };*/

            state = {
                ...state
            }

            state.matches[state.currentmatch].sets = [...state.matches[state.currentmatch].sets];
            state.matches[state.currentmatch].sets[0] = cset;

            notify('send-state', {state: {...state}});
            break;
        }
        case "addScore" : {

            let cset = state.matches[state.currentmatch].sets[0];
            let scores = [...cset.scores];

            scores[payload.player]++;

            cset = {
                ...cset,
                scores: scores
            };

            if ((cset.scores[0] + cset.scores[1]) % state.numserves === 0) {
                cset.serving = cset.serving === 0 ? 1 : 0;
            }

            state = {
                ...state
            }

            state.matches[state.currentmatch].sets = [...state.matches[state.currentmatch].sets];
            state.matches[state.currentmatch].sets[0] = cset;

            notify('send-state', {state: {...state}});

            break;
        }
        case "removeScore" : {

            let cset = state.matches[state.currentmatch].sets[0];

            if (cset.scores[payload.player] > 0) {

                let wasOnService = (cset.scores[0] + cset.scores[1]) % state.numserves === 0;
                let scores = [...cset.scores];

                scores[payload.player]--;

                cset = {
                    ...cset,
                    scores: scores
                };

                if ((cset.scores[0] + cset.scores[1]) === 0) {
                    cset.serving = cset.initialserve;
                }
                else if (wasOnService) {
                    cset.serving = cset.serving === 0 ? 1 : 0;
                }

                state = {
                    ...state
                }

                state.matches[state.currentmatch].sets = [...state.matches[state.currentmatch].sets];
                state.matches[state.currentmatch].sets[0] = cset;
            }

            notify('send-state', {state: {...state}});

            break;
        }
        case "undoEndSet" : {

            if (state.matches[state.currentmatch].sets.length > 1) {

                state = {
                    ...state
                }

                state.matches[state.currentmatch].sets = [...state.matches[state.currentmatch].sets];
                state.matches[state.currentmatch].sets.shift();

                notify('send-state', {state: {...state}});
            }

            break;
        }
        case "endSet" : {
           // history.push(cloneState(state));

            state = {
                ...state
            }

            let nset = cloneSet(state.matches[state.currentmatch].sets[0]);
            //nset.results = [...nset.results, [...nset.scores]];
            nset.scores = [0, 0];
            nset.swapped = !state.matches[state.currentmatch].sets[0].swapped;
            nset.initialserve = state.matches[state.currentmatch].sets[0].initialserve === 0 ? 1 : 0;
            nset.serving = nset.initialserve;

            state.matches[state.currentmatch].sets = [
                nset,
                ...state.matches[state.currentmatch].sets
            ];


           // state = {
               // ...state,
                //results: [...state.results, [...state.scores]],
                //scores: [0, 0],
                //swapped: !state.swapped,
                //initialserve: state.initialserve === 0 ? 1 : 0,
                //serving: state.initialserve
            //};

            notify('send-state', {state: {...state}});

            break;
        }
        case "newMatch" : {

            //window.open(window.location);

            state = {
                ...state,
                matches: [{
                    sets: [cloneSet(newset)]
                }, ...state.matches]
            }

            notify('send-state', {state: {...state}});



            break;
        }
        default:
    }
    return state;
};

export default matchReducer;

/*export function getHistory() {
  return history;
}*/

//export function cloneState(state) {
export function cloneSet(set) {
  return {
    ...set,
    players : [...set.players],
    //results : [...set.results.map(item => [...item])],
    scores : [...set.scores]
  };
}

