import { notify } from '../socket';
import { AppMode } from '../constants/AppMode';
import { MatchType } from '../constants/MatchType';

const ConfigDefaults = {
  numserves: 5,
  playto: 21,
  matchtype: MatchType.SINGLES,
  mode: AppMode.VIEW
}

const cloneSet = (set) => {
  return {
    ...set,
    players : [...set.players],
    playerswap : [...set.playerswap],
    scores : [...set.scores]
  };
}

const blankset = {
    firstload: true,
    players: ["", ""],
    playerswap: [false, false],
    scores: [0,0],
    swapends: false,
    initialserve: 0,
    serving: 0
};

const initialstate = {
    mode: ConfigDefaults.mode,
    numserves: ConfigDefaults.numserves,
    playto: ConfigDefaults.playto,
    matchtype: ConfigDefaults.matchtype,
    currentmatch: 0,
    matchcode: 'initial',
    matches: [{
        started: false,
        sets: [cloneSet(blankset)]
    }]
}

/*const initialstate = {
    mode: ConfigDefaults.mode,
    numserves: ConfigDefaults.numserves,
    playto: ConfigDefaults.playto,
    matchtype: MatchType.DOUBLES,
    currentmatch: 0,
    matchcode: '1234',
    matches: [{
        started: true,
        sets: [{...cloneSet(blankset),scores:[5,12],players:["Narelle","Hidir", "Deane", "Greg"]}, {...cloneSet(blankset),scores:[21,18],players:["Narelle","Hidir", "Deane", "Greg"]},{...cloneSet(blankset),scores:[7,18],players:["Narelle","Hidir", "Deane", "Greg"]}]
    }]
}
*/

/*const initialstate = {
    mode: ConfigDefaults.mode,
    numserves: ConfigDefaults.numserves,
    playto: ConfigDefaults.playto,
    matchtype: ConfigDefaults.matchtype,
    currentmatch: 0,
    matchcode: '12345',
    matches: [{
        started: false,
        sets: [cloneSet(blankset)]
    },
    {
        started: true,
        sets: [{...cloneSet(blankset),scores:[10,5]}, {...cloneSet(blankset),scores:[10,5]}]
    },
    {
        started: true,
        sets: [{...cloneSet(blankset),scores:[5,12],players:["Narelle","Hidir"]}, {...cloneSet(blankset),scores:[21,18],players:["A","B"]},{...cloneSet(blankset),scores:[7,18],players:["A","B"]}]
    }]
}*/



const determineService = (matchtype, numserves, playto, initialserver, scores) => {

    let server = initialserver;
    let totalscore = scores.reduce((a, b) => a + b);
    let playerswap = [false, false];

    // not started - return initial server
    if (totalscore === 0) return {
        server,
        playerswap
    };

    let services = Math.ceil(totalscore / numserves);

    // if whole number then score is at service and need to switch serve
    if (totalscore % numserves === 0) services += 1;

    // check if deuce
    if (scores[0] >= playto-1 && scores[1] >= playto-1 && totalscore >= ((playto-1) * 2)) {
        services = totalscore - ((playto-1) * 2) + 1;
    }

    if (matchtype === MatchType.SINGLES) {
        if (services % 2 === 0) {
            // second player serves on every second service
            server = initialserver === 0 ? 1 : 0;
        }
        else {
            // first player serves on alternate service
            server = initialserver;
        }
    }
    else if (matchtype === MatchType.DOUBLES) {

        switch (services % 4) {
            case 1 : // first team first server (initialserver)
                server = initialserver;
                playerswap = [false, false];
                break;
            case 2 : // second team first server
                server = initialserver === 0 ? 2 : 0;
                playerswap = initialserver === 0 ? [true, false] : [false, true];
                break;
            case 3 : // first team second server
                server = initialserver === 0 ? 1 : 3;
                playerswap = [true, true];
                break;
            case 0 : // second team second server
                server = initialserver === 0 ? 3 : 1;
                playerswap = initialserver === 0 ? [false, true] : [true, false];
                break;
            default:
        }

    }

    return {
        server,
        playerswap
    };
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
        case "setCurrentMatch": {

            state = {
                ...state,
                currentmatch: payload.match
            };

            notify('send-state', {state: {...state}});
            break;
        }
        case "setPlayTo": {

            state = {
                ...state,
                playto: payload.playto,
                numserves: payload.numserves
            };

            notify('send-state', {state: {...state}});
            break;
        }
        case "setMatchType": {

            state = {
                ...state,
                matchtype: payload.matchtype
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

            if (state.matchcode === "initial") { // only if initial to avoid overwriting on socket disconnect/reconnect

                state = {
                    ...state,
                    matchcode: payload.code
                };

                notify('send-state', {state: {...state}});

            }
            break;
        }
        case "startMatch": {

            let cset = {
                ...state.matches[state.currentmatch].sets[0],
                initialserve: payload.firstserver,
                serving: payload.firstserver,
                firstload: false
            }

            state = {
                ...state
            }

            state.matches[state.currentmatch] = {
                ...state.matches[state.currentmatch],
                started: true
            };

            state.matches[state.currentmatch].sets = [...state.matches[state.currentmatch].sets];
            state.matches[state.currentmatch].sets[0] = cset;

            notify('send-state', {state: {...state}});
            break;
        }
        case "setPlayerName": {

            let cset = {
                ...state.matches[state.currentmatch].sets[0]
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

            let service = determineService(state.matchtype, state.numserves, state.playto, cset.initialserve, scores);

            cset = {
                ...cset,
                scores: scores,
                serving: service.server,
                playerswap: service.playerswap
            };

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

                let scores = [...cset.scores];

                scores[payload.player]--;

                let service = determineService(state.matchtype, state.numserves, state.playto, cset.initialserve, scores);

                cset = {
                    ...cset,
                    scores: scores,
                    serving: service.server,
                    playerswap: service.playerswap
                };

                state = {
                    ...state
                }

                state.matches[state.currentmatch].sets = [...state.matches[state.currentmatch].sets];
                state.matches[state.currentmatch].sets[0] = cset;
                
                notify('send-state', {state: {...state}});
            }

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

            state = {
                ...state
            }

            let nset = cloneSet(state.matches[state.currentmatch].sets[0]);
            nset.scores = [0, 0];
            nset.playerswap = [false, false];
            nset.swapends = !state.matches[state.currentmatch].sets[0].swapends;

            switch (state.matchtype) {
                case MatchType.SINGLES :
                    nset.initialserve = state.matches[state.currentmatch].sets[0].initialserve === 0 ? 1 : 0;
                    break;
                case MatchType.DOUBLES :
                    nset.initialserve = state.matches[state.currentmatch].sets[0].initialserve === 0 ? 2 : 0;
                    break;
                default:
            }
            
            nset.serving = nset.initialserve;

            state.matches[state.currentmatch].sets = [
                nset,
                ...state.matches[state.currentmatch].sets
            ];

            notify('send-state', {state: {...state}});

            break;
        }
        case "cancelMatch" : {

            let matches = [...state.matches];
            matches.shift();
            matches.unshift({
                sets: [cloneSet(blankset)]
            });

            state = {
                ...state,
                matches: matches
            }

            notify('send-state', {state: {...state}});

            break;
        }
        case "newMatch" : {

            state = {
                ...state,
                matches: [{
                    sets: [cloneSet(blankset)]
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