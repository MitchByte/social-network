import ProfilePic from "./profilepic";
import BioEditior from "./bio"


export default function Profile({first,last,imageUrl}) {
    return (
        <div className="profile-box">
            <div className="big-profile-pic">
                <ProfilePic 
                    imageUrl = {imageUrl}
                />
            </div>
            
            <p>Hello, my name is {first} {last}</p>

            <BioEditior/>
        </div>
    )
}