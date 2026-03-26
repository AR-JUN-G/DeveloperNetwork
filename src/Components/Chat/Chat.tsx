import { useEffect } from "react";
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow/ChatWindow";
import ChatSideBar from "./ChatSideBar/ChatSideBar";
import "./Chat.css";

const socket = io("http://localhost:7777");

const Chat = () => {
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected with Backend Successfully", socket.id);
        })

        return () => {
            socket.off("connect");
        }
    }, [])

    return (
        <div className="chat-container">
            <ChatSideBar />
            <ChatWindow />
        </div>
    )
}

export default Chat;
