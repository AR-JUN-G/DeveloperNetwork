import { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow/ChatWindow";
import ChatSideBar from "./ChatSideBar/ChatSideBar";
import "./Chat.css";
import { useParams } from "react-router";
import { availableMemberResponseType, directChatResponseType } from "../../Types/ChatAPI.types";
import { getAvailableMemebersForChat, getChatList } from "../../API/ChatAPI";
import { motion } from "motion/react";
import FriendListPopup from "../FriendListPopup/FriendList";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { useSocket } from "../../Context/SocketProvider";

const Chat = () => {
    const { socket } = useSocket();
    const user = useSelector((state: RootState) => state.User);
    const { toUserID } = useParams();
    const [renderFriendListPopup, setRenderFriendListPopup] = useState<boolean>(false);
    const [chatList, setChatList] = useState<directChatResponseType[]>([]);
    const [friendList, setFriendList] = useState<availableMemberResponseType[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    const getUserChatList = async () => {
        try {
            const response = await getChatList();
            if (response.status === 200) {
                setChatList(response.data?.chats || []);
            }
        } catch (error) {
            console.error("Error fetching chat list:", error);
        }
    }

    const getFriendListToChat = async () => {
        try {
            const response = await getAvailableMemebersForChat();
            if (response.status === 200) {
                setFriendList(response.data?.members || []);
            }
        }
        catch (error) {
            console.error("Error occured while Fetching the friend List", error);
        }
    }

    const handleStartChatClick = () => {
        getFriendListToChat();
        setRenderFriendListPopup(true);
    }
    useEffect(() => {
        getUserChatList();
    }, []);

    const selectedUser =
        chatList.find(chat => chat.userID === toUserID) ||
        friendList.find(friend => friend._id === toUserID);

    useEffect(() => {
        if (!socket) return;

        socket.on("connect", () => {
            console.log("Connected with Backend Successfully", socket.id);
        });

        socket.on("getOnlineUser", (users: string[]) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off("connect");
            socket.off("getOnlineUser");
        }
    }, [socket])

    if (!socket) return <div className="loading-spinner-container"><div className="spinner"></div></div>;

    return (
        <div className="chat-container">
            <ChatSideBar socket={socket} chatList={chatList} onlineUsers={onlineUsers} />
            {toUserID ? (
                <ChatWindow socket={socket} toUserID={toUserID} selectedUser={selectedUser} onlineUsers={onlineUsers} />
            ) : (
                <div className="chat-placeholder">
                    <div className="placeholder-content">
                        <div className="placeholder-icon">💬</div>
                        <h2>Select a conversation</h2>
                        <motion.button type="submit"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="start-chatButton"
                            onClick={handleStartChatClick}
                        >Start Chatting</motion.button>
                    </div>
                </div>
            )}
            {renderFriendListPopup ? <FriendListPopup friends={friendList} onClose={() => setRenderFriendListPopup(false)} /> : <></>}
        </div>
    )
}

export default Chat;
