import { combineReducers } from "redux";
import friendsReducer from "./friends/slice"

const rootReducer = combineReducers({
    friends: friendsReducer,
});

export default rootReducer;