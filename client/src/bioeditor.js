import { Component } from "react";
import axios from "axios";


export default class BioEditior extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorVisible: false,
            draftBio: null,
        };
        console.log("bioeditor.js:  this.props in contructor: ", this.props);

        this.toggleTextarea = this.toggleTextarea.bind(this);
        this.updateDbBio = this.updateDbBio.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    toggleTextarea() {
        this.setState({editorVisible: !this.state.editorVisible});
    }

    handleChange({target}){
        console.log("bioeditor.js: this state before handlechange:", this.state)

        //console.log("HANDLE CHANGE IN BIO.js", target);
        //console.log("[target.name]:target.value}",{[target.name]:target.value})
        this.setState({[target.name]:target.value});
        //this.setState({value: target.value})
        console.log("bioeditor.js: this state after handlechange:", this.state)

    }

    updateDbBio() {
        console.log("sending this axios post to profile/bio: ",this.state);
        axios
            .post("/profile/bio", this.state)
            .then(({data}) => {
                console.log("updateDBBio:", data);
                this.props.methodInBio(data.bio);
                //needs to reload to see new bio
                //location.reload();  
                this.toggleTextarea();
                
            })
            .catch((err) => {
                console.log("ERROR: bio.js: updateDbBio:", err)
            })
    }


    render() {
        return (
            <div className="bio">
                {this.props.bio && !this.state.editorVisible && 
                    <div>
                        <p className="bio-text">{this.props.bio}</p>
                        <button className="update-bio-button" onClick={this.toggleTextarea}>Update Bio</button>
                    </div>
                }

                {this.state.editorVisible && 
                    <div>
                        <textarea name="bio" onChange={this.handleChange} defaultValue={ this.props.bio} rows="5" cols="50"/> 
                        <button className="save-bio-button" onClick={this.updateDbBio}>Save</button>
                    </div>
                }
                {!this.props.bio && !this.state.editorVisible &&
                <p className="add-bio" onClick={this.toggleTextarea}> Add Bio</p>
                }
                
            </div>

        )
    }
}