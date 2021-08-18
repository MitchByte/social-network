//action creators {type:"domain/thingThatHappened",payload:{list:""}}

export function receiveFriendsAndWannabees(friends) {
    console.log("action creators: receiveFriendsandwannabees: data", friends);
    return {
        type:"friends/received",
        payload: {friends},
    };
    //creates an action to populate the state with the current list of friends and wannabees
}

export function acceptFriendRequest(id) {
    //creates an action to accept a wannabee as a friend, the id should be in the payload
    return {
        type: "friends/accepted",
        payload: id
    }
}

export function unfriend(id) {
    //creates an action to end a friendship, the id should be in the payload
    return {
        type: "friends/unfriended",
        payload: id
    }
}


//friends reducer 
export default function friendsReducer(state=[],  action) {
    console.log("SLICE:JS: action:", action)
    if( action.type == "friends/received") {
        //should set the state to be the array of friends and wannabees
        state = action.payload.friends
    }
    if(action.type == "friends/accepted") {
        //one of the users in the existing array of friends and wannabees should have their accepted
        // property set to true. (you may want to use the .map() method)
        state = state.map(friend=> {
            if(friend.id === action.payload.id) {
                return {...friend, accepted: true}
            }
        })
    }
    if(action.type == "friends/unfriended") {
        //one of the users in the existing array of friends and wannabees should be removed. 
        //(you may want to use the .filter() method)
        state = state.map(friend=> {
            if(friend.id === action.payload.id) {
                return {}
            }
        })
    }
    return state
}