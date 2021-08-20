export let socket;
import { io } from "socket.io-client";
import {chatMessagesReceived,chatMessageReceived} from "./redux/messages/slice.js";

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }

    socket.on("chatMessages", (data) => {
        console.log("SOCKET: last 10", data)
        store.dispatch(chatMessagesReceived(data));
    });

    socket.on("chatMessage", (data) => {
        console.log("SOCKET DATA: new message ", data)
        store.dispatch(chatMessageReceived(data));
    });
};