import { FiSearch, FiSettings, FiMoreVertical } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import "./ChatSideBar.css";
import { useEffect, useState } from "react";
import { directChatResponseType } from "../../../Types/ChatAPI.types";
import formatChatTime from "../../../utils/FormatDate";
import { Socket } from "socket.io-client";
import { useParams, useNavigate } from "react-router";

interface ChatSideBarProps {
    socket: Socket;
    chatList: directChatResponseType[];
    onlineUsers: string[];
}

const ChatSideBar = ({ socket, chatList, onlineUsers }: ChatSideBarProps) => {
    const navigate = useNavigate();
    const { toUserID: activeChatID } = useParams();

    const user = useSelector((state: RootState) => state.User);

    const handleChatClick = (chat: directChatResponseType) => {
        const fromUserID = user.userID;
        const toUserID = chat?.userID;
        const fromUserName = user.firstName;
        const toUserName = chat.firstName;
        if (fromUserID && toUserID) {
            socket.emit('joinChat', { fromUserID, toUserID, fromUserName, toUserName });
        }
        navigate(`/direct/inbox/${chat.userID}`);
    }

    useEffect(() => {
        if (activeChatID && chatList.length > 0) {
            const currentChat = chatList.find(c => c.userID === activeChatID);
            if (currentChat) {
                handleChatClick(currentChat);
            }
        }
    }, [activeChatID, chatList]);

    return (

        <aside className="chat-sidebar">
            <header className="sidebar-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h1 className="sidebar-title" style={{ margin: 0 }}>Messages</h1>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <FiSettings size={20} />
                    </button>
                </div>
                <div className="search-box">
                    <FiSearch className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="search-input"
                    />
                </div>
            </header>

            <div className="conversation-list">

                {chatList.map((chat) => (
                    <div
                        key={chat.userID}
                        className={`conversation-item ${chat.userID === activeChatID ? 'active' : ''}`}
                        onClick={() => handleChatClick(chat)}
                    >
                        <div className="avatar-container">
                            <img
                                src={`https://ui-avatars.com/api/?name=${chat.firstName + " " + chat.lastName}&background=6366f1&color=fff`}
                                alt={chat.firstName + " " + chat.lastName}
                                className="chat-avatar"
                            />
                            {onlineUsers.includes(chat.userID) && <div className="status-dot"></div>}
                        </div>
                        <div className="chat-info">
                            <div className="chat-name-row">
                                <span className="chat-name">{chat.firstName + " " + chat.lastName}</span>
                                <span className="chat-time">{formatChatTime(chat.time)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p className="last-msg">{chat.latestMessage}</p>

                                {/* Need to Implement Unread Count Feature */}
                                {/* {chat.unread > 0 && (
                                    <span className="unread-badge">{chat.unread}</span>
                                )} */}
                            </div>
                        </div>
                    </div>
                ))}

            </div>

        </aside>

    );
}

export default ChatSideBar;