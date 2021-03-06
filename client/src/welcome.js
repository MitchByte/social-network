import {HashRouter, Route} from "react-router-dom";
import Logo from "./logo";
import {Registration} from "./registration";
import {Login} from "./login";
import {ResetPassword} from "./resetpassword";

export default function Welcome() {
    return (
        <div className="welcome">
            <Logo id="logo"/>
            <h3>Your pool with a splash of new people</h3>
            <HashRouter>
                <div className="welcome-form">
                    <Route exact path="/" component={Registration} />
                    <Route path="/userlogin" component={Login} />
                    <Route path="/password-reset" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}