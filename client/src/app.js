import { Component} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import {BrowserRouter, Route} from "react-router-dom";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
import Friends from "./friends";



export default class App extends Component {
    constructor() {
        super();
        this.state = {
            error:false,
            first: "",
            last: "",
            imageUrl: "",
            bio:"",
            imgUploadVisible: false,
            id:null, 

        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.toggleUploader= this.toggleUploader.bind(this);
        this.methodInApp = this.methodInApp.bind(this);
        this.methodInBio = this.methodInBio.bind(this);
    }

    
    componentDidMount() {
        axios
            .get("/user")
            .then(({data}) => {
                if(data.success){
                    console.log("app.js. axios.get/user: data.userObj", data.userObj)
                    let {firstname,lastname,imageurl,bio,id} = data.userObj;
                    this.setState({
                        first : firstname,
                        last: lastname,
                        imageUrl: imageurl,
                        bio: bio,
                        id: id,
                    })
                    console.log("app.js state after get/user:", this.state)
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
        //console.log("APP.js: methodinapp", arg);
        this.state.imageUrl = arg;
        this.toggleUploader()
    }

    methodInBio(arg) {
        //console.log("app.js: methodinBio:arg: ", arg);  
        this.setState({bio: arg.bio})
    }

    render() {
        return (
            <div>
                


                <BrowserRouter>
                    <div className="header">
                        <Logo/>
                        <div onClick={this.toggleUploader}>
                            <ProfilePic 
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                            className="header-pic"
                            />
                        </div>
                        <div>
                            {this.state.error && (<h1 style={{ color: "red" }}>Something went wrong with getting your information</h1>)}
                        </div>
                    </div>
                    <div>
                        <div className="link-list">
                            <div><Link to="/users">Find people</Link></div>
                            <div> <Link to="/">My Profile</Link></div>
                            <div><Link to="/logout">Logout</Link></div>
                            <div><Link to="/friends">Friends</Link></div>
                        </div>

                        <Route exact path="/"
                            render={() => (
                                <div className="main-body">
                                    <div className="profile">
                                    <Profile
                                        first={this.state.first}
                                        last={this.state.last}
                                        imageUrl={this.state.imageUrl}
                                        bio = {this.state.bio}
                                        methodInBio = {this.methodInBio}
                                        id={this.state.id}
                                    />
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
                            )}
                        />
                      
                        <Route path ="/user/:id"
                            render={props => (
                                <div className="profile-box">
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                                </div> 
                            )}
                        />
                        <Route path ="/users"
                            render={props => (
                                <div className="find-box">
                                <FindPeople
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                    id={this.state.id}
                                />
                                </div> 
                            )}
                        />
                        <Route path="/friends"
                            render={props => (
                                <Friends
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )} 
                        />
                    </div>
                </BrowserRouter>
            </div>

        )
    }

}