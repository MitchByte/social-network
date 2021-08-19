import ReactDOM from "react-dom";
import Welcome from "./welcome";
import axios from "axios";
import App from "./app";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import reducer from "./redux/reducer.js";
import {init} from "./socket"



const store = createStore(
    reducer,
    applyMiddleware(immutableState.default())
);
const elem = (
     <Provider store={store}>
         <App />
     </Provider>
 );

axios.get('/user/id.json').then(function({data}) {
    if (!data.userId) {
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    } else {
        init(store);
        ReactDOM.render(elem, document.querySelector("main"));
    }
});