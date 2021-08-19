//action creators {type:"domain/thingThatHappened",payload:{list:""}}

export function receiveFriendsAndWannabees(fnwarray) {
    console.log("action creators: receiveFriendsandwannabees:", fnwarray);
    return {
        type:"friends/received",
        payload: fnwarray,
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
        state = action.payload,

        console.log("friends/received: STATE: ", state);
        console.log("actions.payload.friends", action.payload)
    }
    if(action.type == "friends/accepted") {
        console.log("SLICE.js:action.payload.id", action.payload);    
        console.log("SLICE: state: ", state);
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