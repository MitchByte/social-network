import {useRef} from 'react';
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";



export default function Chat () {
    const elemRef = useRef();
    const messages = useSelector((state) => state.messages);

    if (!messages) { return null};

    const send = (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            socket.emit("new-message", e.target.value);
            e.target.value = "";
        }
    }
    console.log("CHAT.JS: state messages", messages)
    const msg = messages[0]

    return (
        <div className="chat-box">
            <h2>Chat</h2>
            <div className="messages">
                {messages && messages.map((message) => (
                    <div key={message.id} className="chat-user-box">
                        <div className="chat-user">
                        <Link to={"/user/"+ message.id}>
                            <img className="chat-pic" src={message.imageurl || "/default-profilepic.jpg"}/>
                            <p className="chat-name">{message.firstname} {message.lastname}</p>

                        </Link>
                        </div>
                        <p>{message.text}</p>
                    </div>

                ))}
            </div>
            <div className="new-messages">
                <textarea onKeyPress={send} placeholder="Let's chat..."  rows="5" cols="50"/>
                <p>Just press enter</p>
            </div>
        </div>
    )

}