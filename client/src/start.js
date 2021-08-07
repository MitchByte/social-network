import ReactDOM from "react-dom";
import Welcome from "./welcome";
import axios from "axios";
import App from "./app"

axios.get('/user/id.json').then(function({data}) {
    if (!data.userId) {
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    } else {
        ReactDOM.render(<App />, document.querySelector("main"));
    }
});