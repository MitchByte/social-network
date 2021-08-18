import {useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import axios from "axios";
import {receiveFriendsAndWannabees,acceptFriendRequest,unfriend} from "./redux/friends/slice.js"
 
export default function Friends () {
    const dispatch = useDispatch();
    const friends = useSelector(state => {
        return state.friends && state.friendsAndWannabes.filter(
            ({accepted}) => accepted
        );
    });
    const wannabes = useSelector(state => {
        return state.friends && state.friendsAndWannabes.filter(
            ({accepted}) => !accepted
        );
    });

    console.log("FRIENDS.JS: friends: ", friends);
    console.log("FRIENDS.JS: wannabes: ", wannabes)

    useEffect(() => {
        console.log(`FRIENDS.JS: useEffect has been rendered`);
        axios
            .get("/api/friends")
            .then(({data}) => {
                console.log("FRIEND: axios get friends:", data);
                dispatch(receiveFriendsAndWannabees(data.friendsAndWannabees))
            })

    })

    return (
        <div className="find-box">
            <div>
                <h3>Friends</h3>
            {!!friends.length && <p>{friends}</p>}
            </div>
            <div>
                <h3>Want to be</h3>
                {!!wannabes.length && <p>{wannabes}</p>}
            </div>

        </div>
    )
}