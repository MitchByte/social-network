import { Component } from "react";
import axios from "axios";

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
        //console.log("which input is running handleChange?", target.name);
        //console.log("value the suer typed:", target.value);
        // updating state!
        this.setState(
            {
                [target.name]: target.value,
            },
            console.log("this.state in Registration:", this.state)
        );
    }
    handleSubmit(e) {
        e.preventDefault(); // prevents button from triggering a refresh
        console.log("user clicked register");
        // when the btn gets clicked we want to make an axios request sending 
        // over our value of state
        console.log("this.state in Register", this.state);
        axios
            .post("/register", this.state)
            .then((response) => {
                if (response.data.success) {
                    console.log("response.data.success",response.data.success);
                    location.reload();
                    // stuff worked well with registering we want to do sth
                    // that sth is trigger a reload, so that our start.js runs 
                    // one more time and asks the server agin whether or not 
                    // the user has the correct cookie :)
                } else {
                    console.log("response.data.success",response.data.success);
                    console.log("register/axios/post: error", response.data);
                    this.state.error = response.data.error;
                    console.log("this.state.error ",this.state.error )
                     
                    // we should render an error!
                    // we need to update our component's state to conditionally 
                    // make an error appear
                }
            })
            .catch(
                (err) =>
                    console.log("something went wrong in POST /register", err)
                // we need to update our component's state to conditionally 
                // make an error appear
            );
    }
    componentDidMount() {
        console.log("Register just mounted");
    }

    render() {
        return (
            <section>
                <h2 style={{ color: "red" }}>{this.state.error} </h2>
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
                    <button onClick={(e) => this.handleSubmit(e)}>
                        Register
                    </button>
                </form>
            </section>
        );
    }
}