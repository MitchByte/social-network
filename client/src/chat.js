import {useRef} from 'react';
import { socket } from "./socket.js";
import { useDispatch,useSelector } from "react-redux";
import { handleText} from "./redux/messages/slice";



export default function Chat () {
    const elemRef = useRef();
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.messages);
    const msg = useSelector((state)=> {
        console.log("state.messages", state.messages);
        return state.messages});
    
    console.log("msg", msg)

    if (!messages) { return null};

    /*const send = () => {
        socket.emit("chatMessage",msg)
    }*/
    const handleChange = ({target}) => {
        console.log("CHAT: textarea value: ", target.value);
        dispatch(handleText(target.value));
    }


    return (
        <div className="chat-box">
            <h2>Chat</h2>
            <div className="messages" ref={elemRef}>
            </div>
            <div className="new-messages">
                <textarea onChange={(e) => handleChange(e)} placeholder="Let's chat..."  rows="5" cols="50"/>
                <button onClick={send()} className="chat-button">Send</button>
            </div>
        </div>
    )

}