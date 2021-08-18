import { combineReducers } from "redux";
import friendsReducer from "./friends/slice"

const rootReducer = combineReducers({
    friendsAndWannbees: friendsReducer
});

export default rootReducer;