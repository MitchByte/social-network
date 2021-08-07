export default function ProfilePic({first,last,imageUrl}) {
    let imgUrl = imageUrl || "./default-profilepic.jpg";
    let alternative = `${first} ${last}` || "default-profilepic";
    return  (
        <div>
            <img className="header-pic" src= {imgUrl} alt={alternative}/>
        </div>

    )
}