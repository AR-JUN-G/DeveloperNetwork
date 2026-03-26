import React from "react";

interface MessageBubbleProps {
    text: string;
    time: string;
    isSent: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, time, isSent }) => {
    return (
        <div className={`message-bubble-row ${isSent ? "sent" : "received"}`}>
            <div className="message-bubble">
                <p style={{ margin: 0 }}>{text}</p>
                <div className="message-time">{time}</div>
            </div>
        </div>
    );
};

export default MessageBubble;
