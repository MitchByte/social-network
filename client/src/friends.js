import {useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import axios from "axios";
import {receiveFriendsAndWannabees,acceptFriendRequest,unfriend} from "./redux/friends/slice.js";
import { Link } from "react-router-dom";

 
export default function Friends () {
    const dispatch = useDispatch();
    const friends = useSelector(state => {
        return state.friends && state.friends.filter(
            ({accepted}) => accepted
        );
    }); 
    const wannabes = useSelector(state => {
        return state.friends && state.friends.filter(
            ({accepted}) => !accepted
        );
    });

    useEffect(() => {
        axios
            .get("/api/friends")
            .then(({data}) => {
                dispatch(receiveFriendsAndWannabees(data.friendsAndWannabees));
            })

    },[])

    const cancel = (arg) => {
        const id = arg;   
        axios
            .post("/button/cancel",{otherId: id})
            .then(({data}) => {
                console.log("FRIENDS.JS: unfriend button worked",data)
            })
            .catch((err) => {
                console.log("FRIENds.JS: button clicked axios.post: ERROR:",err)
            })
    }

    const accept = (arg) => {
        const id = arg;   
        axios
            .post("/button/accept",{otherId: id})
            .then(({data}) => {
                console.log("FRIENDS.JS: accept button worked",data)
            })
            .catch((err) => {
                console.log("FRIENds.JS: button clicked axios.post: ERROR:",err)
            })
    }


    return (
        <div className="friends-box">
            <div>
                <h3>Friends</h3>
                <div className="f-box">
                {friends && friends.map((user) => (
                    <div key={user.id} className="friendjs-box">
                        <Link to={"/user/"+ user.id}>
                            <img className="user-pic" src={user.imageurl || "/default-profilepic.jpg"}/>
                            
                        </Link>
                        <div className="friendjs-desc">
                            <Link to={"/user/"+ user.id}><p>{user.firstname} {user.lastname}</p></Link>
                            <button onClick={()=> {dispatch(unfriend(user.id)); cancel(user.id)}}  className="friendjs-button">Unfriend</button>
                        </div>
                    </div>
                ))}

                </div>

            </div>
            <div>
                <h3>Want to be</h3>
                <div className="w-box">
                {wannabes && wannabes.map((user) => (
                    <div key={user.id} className="friendjs-box">
                        <Link to={"/user/"+ user.id}>
                            <img className="user-pic" src={user.imageurl || "/default-profilepic.jpg"}/>
                        </Link>
                        <div>
                            <Link to={"/user/"+ user.id}><p>{user.firstname} {user.lastname}</p></Link>
                            <button onClick={() =>{dispatch(acceptFriendRequest(user.id)); accept(user.id)}}  className="friendjs-button">Accept FriendRequest</button>
                        </div>
                    </div>
                ))}
                </div>
            </div>

        </div>
    )
}