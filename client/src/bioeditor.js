import { Component } from "react";
import axios from "axios";


export default class BioEditior extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorVisible:false,
            draftBio:props.bio,
        };
        console.log("bioeditor.js:this.props.bio in contructor: ", this.props.bio);
        console.log("bioeditor.js: props in contructor: ",props.bio);

        console.log("what does draftbio look like: ", this.draftBio)

        this.toggleTextarea = this.toggleTextarea.bind(this);
        this.updateDbBio = this.updateDbBio.bind(this);
        this.handleChange = this.handleChange.bind(this);


    }

    toggleTextarea() {
        this.setState({editorVisible: !this.state.editorVisible});
    }

    handleChange({target}){
        //console.log("HANDLE CHANGE IN BIO.js", target);
        console.log("[target.name]:target.value}",{[target.name]:target.value})
        this.setState({[target.name]:target.value});
        //console.log("this state after target.value:", this.state)

    }

    updateDbBio() {
        console.log("sending this axios post to profile/bio: ",this.state)
        axios
            .post("/profile/bio", this.state)
            .then(({data}) => {
                console.log("updateDBBio:", data);
                this.setState({draftBio: data.bio})
                console.log("bioeditor.js: THIS STATE AFTER click update bio",this.state)
            })
            .catch((err) => {
                console.log("ERROR: bio.js: updateDbBio:", err)
            })
    }


    render() {
        return (
            <div className="bio">
                <p className="bio-text">
                    {this.draftBio}
                </p>
                {this.state.editorVisible && 
                    <div>
                        <textarea name="bio" onChange={this.handleChange}/> 
                        <button onClick={this.updateDbBio,this.toggleTextarea}>Save</button>
                    </div>}
                {!this.state.editorVisible && 
                    <button onClick={this.toggleTextarea}>Update Bio</button>}
            </div>

        )
    }
}