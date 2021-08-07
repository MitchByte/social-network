import { Component } from "react";
import axios from "axios";


export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file:null
        };
        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.closeUploader = this.closeUploader.bind(this)

        console.log("props in Uploader: ", props);
    }

    uploadImage() {
        var file = this.file;
        var formData = new FormData();
        formData.append('file', file);
        axios
            .post('/upload', formData)
            .then(({data})=> {
                console.log("axios upload email:", data.imgUrl);
                this.props.methodInApp(data.imgUrl)
            })
            .catch((err) => {
                console.log("", err);
            })
    
    }

    handleFileSelection(e) {
                this.file = e.target.files[0];
    }

    closeUploader() {
        this.props.toggleUploader()
    }

    render() {
        return (
            <div className="uploader">
                <p className="closeX" onClick={this.closeUploader}>X</p>
                <h1>Change Profile Picture</h1>
                <p>Click the button to upload a new profile picture.</p>
                <input type="file" onChange={this.handleFileSelection} className="file-input"/>
                <button className="form-button" onClick={this.uploadImage}>Upload</button>
            </div>
        );
    }
}