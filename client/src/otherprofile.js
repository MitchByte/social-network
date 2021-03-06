import { Component } from "react";
import axios from "axios";
import ProfilePic from "./profilepic";
import FriendButton from "./friendbutton"


export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state= {
            error:false,
            first: "",
            last: "",
            imageUrl: "",
            bio:"",
            id:null,
        };
        this.getId = this.getId.bind(this);
    }
    componentDidMount() {
        this.getId()
    }
    getId() {
        let userID = this.props.match.params.id;
        axios
            .get(`/api/user/${userID}`)
            .then(({data}) => {
                console.log("OTHERPROFILE.JS: axios.request: datauserObj:", data.userObj)
                if(!data.userObj) {
                    this.props.history.push("/");
                } else {
                     this.setState({
                        first: data.userObj.firstname,
                        last: data.userObj.lastname,
                        imageUrl: data.userObj.imageurl,
                        bio: data.userObj.bio,
                        id:this.props.match.params.id,
                    });
                }   
            })
            .catch((err) => {
                console.log("Error: OTHERPROFILE.JS: axios.get/user/:id: ", err)
            })
    }

    render() {
        return (
            <div className="otherprofile">
                <div className="otherprofile-box">
                    <ProfilePic 
                        imageUrl = {this.state.imageUrl}
                        className = "big-profile-pic"
                    />
                    <FriendButton
                        idUrl = {this.props.match.params.id}
                        className = "otherprofile-button"
                    />
                </div>
                <div className="otherprofile-box">
                    <h2>{this.state.first} {this.state.last}</h2>
                    <p>Bio</p>
                    <p className="bio-box">{this.state.bio}</p>

                </div>
            </div>
        )
    }
}