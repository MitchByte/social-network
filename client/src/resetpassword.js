import { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export class ResetPassword extends Component {
    constructor(props) {
        super();
        this.state = { view: 1};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleChange({target}){
        this.setState({[target.name]:target.value})
    }
    handleSubmit(e) {
        e.preventDefault();
        console.log("THIS STATE RESET PASSWORD BEFORE AXIOS POST: ",this.state)
        axios
            .post("/reset-password", this.state)
            .then()
    }

    determineViewToRender() {
    // this method determines what the render! 
    if (this.state.view === 1) {
        return (
            <div>
                <h1>Reset Password</h1>
                <p>Please enter the email address with which you registered</p>
                <form>
                    <input 
                        name="email"
                        placeholder="Email"
                        onChange={this.handleChange}
                    />
                    <button className="form-button" onClick={(e) => this.handleSubmit(e)}>
                        Submit
                    </button>
                </form>
            </div>
        );
    } else if (this.state.view === 2) {
        return (
            <div>
                <h1>View 2: two inputs (reset code, new pw), & one button</h1>
            </div>
        );
    } else if (this.state.view === 3) {
    // remember to also add a link to login ;)
        return (
            <div>
                <h1>success msg & link back to Login!</h1>
            </div>
        );
    }
}

render() {
    return (
        <div>
            {/* call the method */}
            {this.determineViewToRender()}
        </div>
    );
}

}

