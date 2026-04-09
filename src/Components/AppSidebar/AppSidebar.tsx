import { NavLink, useNavigate } from "react-router";
import { FiHome, FiMessageSquare, FiCompass, FiUser, FiLogOut, FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { removeUserDetails } from "../../Store/userSlice";
import "./AppSidebar.css";
import { LogoutAPI } from "../../API/AuthAPI";

const AppSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.User);

    const handleLogout = async () => {
        try {
            await LogoutAPI();
            dispatch(removeUserDetails());
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="app-sidebar">
            <div className="sidebar-logo" onClick={() => navigate("/home")}>
                <div className="logo-icon">
                    <FiHeart size={24} fill="currentColor" />
                </div>
            </div>

            <div className="sidebar-nav">
                <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Home">
                    <FiHome size={24} />
                    <span className="nav-label">Discover</span>
                </NavLink>
                <NavLink to="/direct/inbox" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Messages">
                    <FiMessageSquare size={24} />
                    <span className="nav-label">Messages</span>
                </NavLink>

                <NavLink to="/requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Requests">
                    <FiHeart size={24} />
                    <span className="nav-label">Matches</span>
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Profile">
                    <FiUser size={24} />
                    <span className="nav-label">Profile</span>
                </NavLink>
            </div>

            <div className="sidebar-footer">
                <button className="nav-item logout-btn" onClick={handleLogout} title="Logout">
                    <FiLogOut size={24} />
                    <span className="nav-label">Logout</span>
                </button>
                <div className="user-mini-avatar" onClick={() => navigate("/profile")}>
                    <img
                        src={user.profilePic || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=333&color=fff`}
                        alt="Me"
                    />
                </div>
            </div>
        </nav>
    );
};

export default AppSidebar;
