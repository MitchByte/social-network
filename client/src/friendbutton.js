import axios from "axios";
import { useState, useEffect } from 'react';

export default function FriendButton(props) {
    //console.log("FRIENDBUTTON.JS: props: ",props);
    let otherUserId = props.idUrl;
    console.log("FRIENDBUTTON.JS: otherUserId: ",otherUserId)
    const [buttonText,setButtonText] = useState();
    const [friendObj, setFriendObj] = useState();
    
    useEffect(() => {
        console.log(`Friendbutton.JS: useEffect has been rendered`);
        getFriendshipStatus();
    })

    const getFriendshipStatus = ()=> {
        axios
            .get(`/checkFriendStatus/${otherUserId}`)
            .then(({data}) => {
                //setFriendObj(data.friendshipStatus[0]);
                console.log("FRIENDBUTTON.JS: axios.get/checkfriendstatus: data.friendships: ", data.friendshipStatus);
                console.log("FRIENDBUTTON.JS: axios.get/checkfriendstatus: ", !data.friendshipStatus[0])
                    //console.log("!data.friendshipStatus.accepted && ",!data.friendshipStatus[0].accepted )
                    //console.log("data.friendshipStatus.recipient_id", data.friendshipStatus[0].recipient_id)
                    console.log("otherUserId",otherUserId)
                    //console.log("data.friendshipStatus.recipient_id == otherUserId", data.friendshipStatus[0].recipient_id == otherUserId)
                if(!data.friendshipStatus[0]) {
                    setButtonText("Send Friend Request");
                } else if (data.friendshipStatus[0].accepted) {
                    setButtonText("End friendship");
                } else if (!data.friendshipStatus[0].accepted && data.friendshipStatus[0].recipient_id == otherUserId) {
                    setButtonText("Cancel friend request");
                } else if (!data.friendshipStatus[0].accepted && data.friendshipStatus[0].recipient_id != otherUserId) {
                    setButtonText("Accept friend request");
                }
            })
            .catch((err) => {
                console.log("ERROR: FRIENDBUTTON.JS: axios.get/checkfriendstatus: ", err)
            })
    }

    const clickButton = () => {
        console.log("---------------------------------------")
        console.log("FRIENDBUTTON.JS: button clicked");
        console.log("friendObj", friendObj);
        axios
            .post(`/checkButton/${buttonText}`) 
            .then(() => {
                getFriendshipStatus()
            })
            .catch((err) => {
                console.log("FRIENDBUTTON.JS: button clicked axios.post: ERROR:",err)
            })

    }

    

    return (
        <div>
            <button onClick={() => clickButton()} className="friend-button">{buttonText}</button>
        </div>
    )
}