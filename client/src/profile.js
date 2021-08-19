import ProfilePic from "./profilepic";
import BioEditior from "./bioeditor"


export default function Profile({first,last,imageUrl,bio,methodInBio}) {
    return (
        <div className="profile-box">
            <div>
                <ProfilePic 
                    imageUrl = {imageUrl}
                    className = "big-profile-pic"
                />
            </div>
            <div className="myprofile-box">
                <h2>{first} {last}</h2>
                <p>My Bio:</p>
                <BioEditior 
                    bio = {bio}
                    methodInBio = {methodInBio}
                />
            </div>
            

            
        </div>
    )
}