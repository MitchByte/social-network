export function chatMessagesReceived(messages) {
    return {
        type: "messages/tenmessages",
        payload: {messages}
    }
}

export function chatMessageReceived(message) {
    return {
        type: "messages/newmessage",
        payload: {message}
    } 
}


export default function chatReducer (state = [], action) {
    if (action.type == "messages/tenmessages") {
        console.log("action.type == messages/tenmessage", state)
        console.log("action payload ten message", action.payload)
        state = action.payload.messages
    }
    if (action.type == "messages/newmessage") {
        state = [...state, action.payload]
    }
    return state;
}