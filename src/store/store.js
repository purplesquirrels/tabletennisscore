import {createStore, combineReducers } from "redux";
//import logger from "redux-logger";

import match from "../reducers/matchReducer";

export default createStore(
    combineReducers({
        matchdata: match
    }),
    {}//,
    //applyMiddleware(logger())
);






