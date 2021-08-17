import { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


export class Login extends Component {
    constructor() {
        super();
        this.state = {error:false};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleChange({target}){
        this.setState({[target.name]:target.value})
    }
    handleSubmit(e){
        e.preventDefault();
        console.log("THIS STATE IN LOGIN POST: ", this.state)
        axios
            .post("/login", this.state)
            .then((response) => {
                if(response.data.success) {
                    console.log("SUCcESSFULL LOGIN: ", response.data.success)
                    location.reload();
                } else {
                    console.log("UNSUCCESSFULL LOGIN: resopnse.data: ", response.data);
                    this.state.error = response.data.error;
                    console.log("this.state.error:", this.state.error)
                }

            })
            .catch((err) => {
                console.log("client login axios post ",err);
                console.log("respnse.data in catch err", response.data)

            })

    }
    render() {
        return (
            <section>
                
                <h2>{this.state.error}</h2>
                <form>
                    <input
                        name="email"
                        placeholder="Email"
                        onChange={this.handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={this.handleChange}
                    />
                    <button className="form-button" onClick={(e) => this.handleSubmit(e)}>
                        Login
                    </button>

                </form>
                <div>
                    <Link to="/">Register</Link>
                </div>
                <div>
                    <Link to="/password-reset">Forgot your password? Reset it here!</Link>
                </div>

            </section>
        )
    }

}