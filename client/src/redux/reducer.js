import { combineReducers } from "redux";
import friendsReducer from "./friends/slice"
import chatReducer from "./messages/slice"

const rootReducer = combineReducers({
    friends: friendsReducer,
    messages: chatReducer,
});

export default rootReducer;