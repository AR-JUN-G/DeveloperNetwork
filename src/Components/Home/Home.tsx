import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";

const Home = () => {

    const navigate = useNavigate();
    const userID =useSelector((state:RootState)=>state.User.userID);
    const handleLogout = () => {
        localStorage.clear();

        navigate("/");
    }
    return (<>
        <h1>Home</h1>
        <button onClick={() => navigate(`/chat/${userID}`)}>Chat</button>
        <> </>
        <button onClick={handleLogout}>Logout</button>
    </>)
}

export default Home;