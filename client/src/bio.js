import { Component } from "react";
import axios from "axios";


export default class BioEditior extends Component {
    constructor() {
        super();
        this.state = {
            editorVisible:false,
            draftBio: "",
        };
        this.toggleTextarea = this.toggleTextarea.bind(this);
        this.updateDbBio = this.updateDbBio.bind(this);
        this.handleChange = this.handleChange.bind(this);


    }

    toggleTextarea() {
        this.setState({editorVisible: !this.state.editorVisible});
    }

    handleChange({target}){
        console.log("HANDLE CHANGE IN BIO.js", target);
        console.log("[target.name]:target.value}",{[target.name]:target.value})
        this.setState({[target.name]:target.value});
        console.log("this state after target.value:", this.state)

    }

    updateDbBio() {
        //let bio = this.draftBio;
        axios
            .post("/profile/bio", this.state)
            .then((result) => {
                console.log("updateDBBio:", result);
                //this.setState({this.draftBio = result})
            })
            .catch((err) => {
                console.log("ERROR: bio.js: updateDbBio:", err)
            })
    }


    render() {
        return (
            <div>
                <p>{this.draftBio}</p>
                {this.state.editorVisible && 
                    <div>
                        <textarea name="bio" onChange={this.handleChange}/> 
                        <button onClick={this.updateDbBio}>Submit</button>
                    </div>}
                {!this.state.editorVisible &&  <button onClick={this.toggleTextarea}>Update Bio</button>}
            </div>

        )
    }
}