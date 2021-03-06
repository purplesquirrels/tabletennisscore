export function setMatchCode(code) {
    return {
        type: "setMatchCode",
        payload: {
            code
        }
    };
}
export function setMatchType(matchtype) {
    return {
        type: "setMatchType",
        payload: {
            matchtype
        }
    };
}
export function setMode(mode) {
    return {
        type: "setMode",
        payload: {
            mode
        }
    };
}
export function setPlayTo(playto, numserves) {
    return {
        type: "setPlayTo",
        payload: {
            playto,
            numserves
        }
    };
}
export function setCurrentMatch(match) {
    return {
        type: "setCurrentMatch",
        payload: {
            match
        }
    };
}

export function setPlayerName(player, value) {
    return {
        type: "setPlayerName",
        payload: {
            player,
            value
        }
    };
}

export function startMatch(firstserver) {
    return {
        type: "startMatch",
        payload: {
            firstserver
        }
    };
}

export function setInitialServe(player) {
    return {
        type: "setInitialServe",
        payload: {
            player
        }
    };
}

export function addScore(player) {
    return {
        type: "addScore",
        payload: {
            player
        }
    };
}

export function removeScore(player) {
    return {
        type: "removeScore",
        payload: {
            player
        }
    };
}

export function undoEndSet() {
    return {
        type: "undoEndSet",
        payload: {}
    };
}

export function endSet() {
    return {
        type: "endSet",
        payload: {}
    };
}

export function cancelMatch() {
    return {
        type: "cancelMatch",
        payload: {}
    };
}

export function newMatch() {
    return {
        type: "newMatch",
        payload: {}
    };
}