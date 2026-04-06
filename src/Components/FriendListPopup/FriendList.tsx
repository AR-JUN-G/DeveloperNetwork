import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router";
import { availableMemberResponseType } from "../../Types/ChatAPI.types";
import "./FriendList.css";

interface FriendListPopupProps {
    friends: availableMemberResponseType[];
    onClose: () => void;
}

const FriendListPopup = ({ friends, onClose }: FriendListPopupProps) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFriends = friends.filter(friend =>
        `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFriendClick = (friend: availableMemberResponseType) => {
        onClose();
        navigate(`/direct/inbox/${friend._id}`);
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    return (
        <div className="friend-list-overlay" onClick={onClose}>
            <div className="friend-list-modal" onClick={(e) => e.stopPropagation()}>
                <header className="friend-list-header">
                    <h2>Select a contact</h2>
                    <button className="close-modal-btn" onClick={onClose} aria-label="Close">
                        <FiX size={20} />
                    </button>
                </header>

                <div className="friend-search-container">
                    <div className="friend-search-box">
                        <FiSearch size={18} />
                        <input
                            type="text"
                            placeholder="Search friends..."
                            className="search-field"
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="friends-scroll-area">
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friend) => (
                            <div
                                key={friend._id}
                                className="friend-item"
                                onClick={() => handleFriendClick(friend)}
                            >
                                <img
                                    src={friend.photourl || `https://ui-avatars.com/api/?name=${friend.firstName}+${friend.lastName}&background=6366f1&color=fff`}
                                    alt={friend.firstName}
                                    className="friend-avatar"
                                />
                                <div className="friend-details">
                                    <span className="friend-name">{friend.firstName} {friend.lastName}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-friends">
                            {searchTerm ? "No friends found matching your search." : "No available friends found."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FriendListPopup;