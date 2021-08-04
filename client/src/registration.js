import { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


export class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange({ target }) {
        this.setState(
            {
                [target.name]: target.value,
            },
            console.log("this.state in Registration:", this.state)
        );
    }
    handleSubmit(e) {
        e.preventDefault(); // prevents button from triggering a refresh
        axios
            .post("/register", this.state)
            .then((response) => {
                if (response.data.success) {
                    location.reload();
                } else {
                    this.state.error = response.data.error;
                    console.log("this.state.error ",this.state.error )
                }
            })
            .catch((err) => {
                console.log("something went wrong in POST /register", err);
                this.state.error = "Something went wrong. Please try again!";
            });
    }
    componentDidMount() {
        console.log("Register just mounted");
    }

    render() {
        return (
            <section>

                {this.state.error && (
                    <h2 style={{ color: "red" }}>{this.state.error}</h2>
                )}
                <form>
                    <input
                        name="firstname"
                        placeholder="First Name"
                        onChange={this.handleChange}
                    />
                    <input
                        name="lastname"
                        placeholder="Last Name"
                        onChange={this.handleChange}
                    />
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
                        Register
                    </button>
                </form>
                <Link to="/login">Already registerd? Log in!</Link>

            </section>

        );
    }
}