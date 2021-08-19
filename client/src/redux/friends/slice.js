export function receiveFriendsAndWannabees(fnwarray) {
    return {
        type:"friends/received",
        payload: fnwarray,
    };
}

export function acceptFriendRequest(id) {
    return {
        type: "friends/accepted",
        payload: id
    }
}

export function unfriend(id) {
    return {
        type: "friends/unfriended",
        payload: id
    }
}


//friends reducer 
export default function friendsReducer(state=null,  action) {
    if( action.type == "friends/received") {
        //should set the state to be the array of friends and wannabees
        state = action.payload,

        console.log("friends/received: STATE: ", state);
        console.log("actions.payload.friends", action.payload)
    }
    if(action.type == "friends/accepted") {
        //one of the users in the existing array of friends and wannabees should have their accepted
        // property set to true. (you may want to use the .map() method)
        state = state.map((friend)=> {
            if(friend.id === action.payload) {
                console.log("accept user: ",friend.id);
                console.log("Accept user: accepted: ", friend.accepted)
                return {...friend, accepted: true}
            } else {
                return friend;
            }
        })
    }
    if(action.type == "friends/unfriended") {
        //one of the users in the existing array of friends and wannabees should be removed. 
        //(you may want to use the .filter() method)
        state = state.map(friend=> {
            if(friend.id === action.payload) {
                
                return {...friend, accepted: false}
            } else {
                return friend;
            }
        })
    }
    return state
}