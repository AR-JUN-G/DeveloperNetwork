import { FiSearch, FiSettings, FiMoreVertical } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import "./ChatSideBar.css";

const mockChats = [
    { id: 1, name: "Arjun G.", lastMsg: "Hey, did you check the new API?", time: "10:30 AM", unread: 2, online: true },
    { id: 2, name: "Deepak S.", lastMsg: "Let's catch up tomorrow.", time: "Yesterday", unread: 0, online: false },
    { id: 3, name: "Priya M.", lastMsg: "The design looks great! 🔥", time: "Monday", unread: 0, online: true },
    { id: 4, name: "Rahul K.", lastMsg: "I'll send the files by evening.", time: "Sunday", unread: 5, online: false },
];

const ChatSideBar = () => {
    const user = useSelector((state: RootState) => state.User);

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
                {mockChats.map((chat) => (
                    <div 
                        key={chat.id} 
                        className={`conversation-item ${chat.id === 1 ? 'active' : ''}`}
                    >
                        <div className="avatar-container">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${chat.name}&background=6366f1&color=fff`} 
                                alt={chat.name} 
                                className="chat-avatar"
                            />
                            {chat.online && <div className="status-dot"></div>}
                        </div>
                        <div className="chat-info">
                            <div className="chat-name-row">
                                <span className="chat-name">{chat.name}</span>
                                <span className="chat-time">{chat.time}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p className="last-msg">{chat.lastMsg}</p>
                                {chat.unread > 0 && (
                                    <span className="unread-badge">{chat.unread}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="sidebar-footer">
                <div className="user-profile-mini">
                    <img 
                        src={user.profilePic || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=333&color=fff`} 
                        alt="Profile" 
                        className="chat-avatar"
                        style={{ width: 40, height: 40 }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.firstName} {user.lastName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Online</span>
                    </div>
                </div>
                <button style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <FiMoreVertical size={20} />
                </button>
            </footer>
        </aside>
    );
}

export default ChatSideBar;