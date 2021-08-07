import { Component} from "react";
import axios from "axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";


export default class App extends Component {
    constructor() {
        super();
        this.state = {
            error:false,
            first: "",
            last: "",
            imageUrl: "",
            imgUploadVisible: false,

        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.toggleUploader= this.toggleUploader.bind(this);
        this.methodInApp = this.methodInApp.bind(this)
    }

    
    componentDidMount() {
        // get infos first from server
        axios
            .get("/user")
            .then(({data}) => {
                if(data.success){
                    console.log("data.userObj", data.userObj)
                    let {firstname,lastname,imageurl} = data.userObj;
                    this.setState({
                        first : firstname,
                        last: lastname,
                        imageUrl: imageurl,
                    })
                } else {
                    this.setState({error: true})
                }  
            })
            .catch((err) => {
                console.log("ERROR in app.js: No userinfo: ", err);
                this.setState({error: true})
            })
    }

    toggleUploader() {
        this.setState({
            imgUploadVisible: !this.state.imgUploadVisible,
        });
    }

    methodInApp(arg) {
        console.log("APP.js: methodinapp", arg);
        this.state.imageUrl = arg;
        this.toggleUploader()
    }

    render() {
        return (
            <div>
                <div className="header">
                    {this.state.error && (
                    <h1 style={{ color: "red" }}>Something went wrong with getting your information</h1>)}
                    <Logo/>
                    <div onClick={this.toggleUploader}>
                        <ProfilePic 
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                    />
                    </div>
                    
                </div>
                <div className="up">
                    {this.state.imgUploadVisible && ( 
                    <Uploader 
                        className="uploader" 
                        methodInApp={this.methodInApp}
                        toggleUploader={this.toggleUploader}
                    />)}
                   
                </div>
                
            </div>

        )
    }

}