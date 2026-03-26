import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { LogoutAPI } from "../../API/AuthAPI";

const Home = () => {

    const navigate = useNavigate();
    const userID = useSelector((state: RootState) => state.User.userID);
    const handleLogout = async () => {
        try {
            const data = await LogoutAPI();
            if (data.message) {
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }

    }
    return (<>
        <h1>Home</h1>
        <button onClick={() => navigate(`/chat/${userID}`)}>Chat</button>
        <button onClick={handleLogout}>Logout</button>
    </>)
}

export default Home;