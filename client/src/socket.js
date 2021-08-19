export let socket;
import { io } from "socket.io-client";
import {chatMessagesReceived,chatMessageReceived} from "./redux/messages/slice.js";

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }

    socket.on("chatMessages", (data) => {
        store.dispatch(chatMessagesReceived(data));
    });

    socket.on("chatMessage", (data) => {
        store.dispatch(chatMessageReceived(data));
    });
};