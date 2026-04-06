import React from "react";
import { FiPhone, FiVideo, FiInfo, FiMoreVertical } from "react-icons/fi";

interface ChatHeaderProps {
    name?: string;
    online?: boolean;
    avatar?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name = "Chat User", online = false, avatar }) => {
    return (
        <header className="chat-header-container">
            <div className="header-user-info">
                <img
                    src={avatar || `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`}
                    alt={name}
                    className="header-avatar"
                />
                <div>
                    <h2 className="header-name" style={{ margin: 0 }}>{name}</h2>
                    <span className="header-status">{online ? "Online" : "Offline"}</span>
                </div>
            </div>
            <div className="header-actions">
                {/* <button className="action-btn"><FiPhone size={20} /></button>
                <button className="action-btn"><FiVideo size={20} /></button>
                <button className="action-btn"><FiInfo size={20} /></button> */}
                <button className="action-btn"><FiMoreVertical size={20} /></button>
            </div>
        </header>
    );
};

export default ChatHeader;
