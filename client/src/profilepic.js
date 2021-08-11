export default function ProfilePic({first,last,imageUrl,className}) {
    let imgUrl = imageUrl || "/default-profilepic.jpg";
    let alternative = `${first} ${last}` || "default-profilepic";
    return  (
        <div>
            <img className={className} src={imgUrl} alt={alternative}/>
        </div>

    )
}