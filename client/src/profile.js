import ProfilePic from "./profilepic";
import BioEditior from "./bioeditor"


export default function Profile({first,last,imageUrl,bio}) {
    return (
        <div className="profile-box">
            <div className="big-profile-pic">

                <ProfilePic 
                    imageUrl = {imageUrl}
                    className = "big-profile-pic"
                />
                <p>Hello, my name is {first} {last}</p>

            </div>
            

            <BioEditior 
                bio = {bio}/>
        </div>
    )
}