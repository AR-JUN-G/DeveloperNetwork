import React, { useState } from "react";
import { FiSend, FiSmile, FiPaperclip } from "react-icons/fi";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import "./ChatWindow.css";

const mockMessages = [
    { id: 1, text: "Hey! How's the project coming along?", time: "10:30 AM", isSent: false },
    { id: 2, text: "It's going great! Almost finished with the Chat UI.", time: "10:31 AM", isSent: true },
    { id: 3, text: "That's awesome! Can't wait to see the final result. 🔥", time: "10:32 AM", isSent: false },
    { id: 4, text: "I'll send a demo link soon. Just polishing some animations.", time: "10:35 AM", isSent: true },
];

const ChatWindow = () => {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        console.log("Sending:", input);
        setInput("");
    };

    return (
        <main className="chat-window">
            <ChatHeader 
                name="Arjun G." 
                online={true} 
            />

            <div className="messages-area">
                {mockMessages.map(msg => (
                    <MessageBubble 
                        key={msg.id} 
                        text={msg.text} 
                        time={msg.time} 
                        isSent={msg.isSent} 
                    />
                ))}
            </div>

            <footer className="chat-input-container">
                <div className="input-wrapper">
                    <button className="input-action-btn">
                        <FiSmile size={20} />
                    </button>
                    <button className="input-action-btn">
                        <FiPaperclip size={20} />
                    </button>
                    <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="message-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="send-btn" onClick={handleSend}>
                        <FiSend size={20} />
                    </button>
                </div>
            </footer>
        </main>
    );
}

export default ChatWindow;