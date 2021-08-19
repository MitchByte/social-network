export function chatMessagesReceived(messages) {
    return {
        type: "messages/tenmessages",
        payload: messages
    }
}

export function chatMessageReceived(message) {
    return {
        type: "messages/newmessage",
        payload: message
    } 
}

export function handleText(text) {
    return {
        type: "messages/handleChange",
        payload: text
    }
}


export default function chatReducer (state = null, action) {
    if (action.type == "messages/tenmessage") {
        return state = action.payload;
    }
    if (action.type == "messages/newmessage") {
        return [...state, action.payload]
    }
    if (action.type == "messages/handleChange") {
        return [...state, action.payload]
    }
    return state;
}