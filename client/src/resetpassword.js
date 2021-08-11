import { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export class ResetPassword extends Component {
    constructor() {
        super();
        this.state = { 
            error: false,
            view: 1
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
        console.log("reset password component mount: state:", this.state);
    }
    handleChange({target}){
        this.setState({[target.name]:target.value})
    }

    handleSubmit(e) {

        e.preventDefault();
        if (this.state.view == 1){
            console.log("view1:THIS STATE RESET PASSWORD BEFORE AXIOS POST: ",this.state)
            return axios
                .post("/reset-password", this.state)
                .then((result) => {
                    console.log("Result after axios post reset password:", result);
                    this.setState({view: 2})
                })
                .catch((err) => {
                    console.log("Err in axios post reset password: ", err)
                })
        } else if (this.state.view == 2) {
            console.log("view2:THIS STATE RESET PASSWORD BEFORE AXIOS POST: ",this.state);
            return axios
                .post("/reset-password/verify", this.state)
                .then((result) => {
                    console.log("Result after axios post reset password:", result.data.success);
                    if( result.data.success) {
                        this.setState({view: 3})
                    } else {
                        //setting error messages right:
                        this.state.error = result.data.error;
                        console.log("reset password false code: ", this.state.error)
                    }
                })
                .catch((err) => {
                    console.log("Err in axios post reset password: ", err)
                })
        }
        
    }

    determineViewToRender() {
    if (this.state.view === 1) {
        return (
            <div>
                <h1>Reset Password</h1>
                <p>Please enter the email address with which you registered</p>
                {this.state.error && <h2 style={{ color: "red" }}>{this.state.error}</h2>}
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
                <h1>Reset Password</h1>
                <p>Please enter the code you received and a new password.</p>
                
                {this.state.error && <h2 style={{ color: "red" }}>{this.state.error}</h2>}
                <form>
                    <input 
                        name="code"
                        placeholder="code"
                        onChange={this.handleChange}
                    />
                    <input 
                        name="newPassword"
                        type="password"
                        placeholder="new password"
                        onChange={this.handleChange}
                    />
                    <button className="form-button" onClick={(e) => this.handleSubmit(e)}>
                        Submit
                    </button>

                </form>
            </div>
        );
    } else if (this.state.view === 3) {
        return (
            <div>
                <h1>Reset Password</h1>
                <p>Success!!</p>
                <p>You can now <Link to="/login">login</Link> with your new password.</p>
            </div>
        );
    }
}

render() {
    return (
        <div>
            {this.determineViewToRender()}
        </div>
    );
}

}

