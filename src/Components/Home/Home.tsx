import "./Home.css";
import { useEffect, useState } from "react";
import { FeedUserType } from "../../Types/ActivityAPI.types";
import { getFeed, sendConnectionRequest } from "../../API/ActivityAPI";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiX, FiRefreshCw } from "react-icons/fi";

const Home = () => {
    const [feed, setFeed] = useState<FeedUserType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFeed = async () => {
        try {
            setIsLoading(true);
            const response = await getFeed();
            if (response.status === 200 && response.data) {
                setFeed(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching feed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (status: "interested" | "ignored", toUserID: string) => {
        // Optimistically remove the user from the feed for an instant snappy feeling
        setFeed(prev => prev.slice(1));
        
        try {
            const response = await sendConnectionRequest(status, toUserID);
            if (response.status !== 200) {
                console.error("Action didn't succeed with 200 status.");
            }
        } catch (error) {
            console.error(`Error during ${status} action:`, error);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const currentUser = feed[0];

    return (
        <div className="home-page">
            <div className="feed-container">
                {isLoading ? (
                    <div className="spinner"></div>
                ) : (
                    <AnimatePresence mode="wait">
                        {currentUser ? (
                            <motion.div 
                                key={currentUser._id}
                                className="developer-card"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -100 }}
                                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            >
                                <div className="card-image-container">
                                    <img 
                                        src={currentUser.photourl || `https://ui-avatars.com/api/?name=${currentUser.firstName}+${currentUser.lastName}&background=111&color=fff&size=512`} 
                                        alt={currentUser.firstName} 
                                        className="card-image" 
                                    />
                                    <div className="card-overlay">
                                        <div className="dev-main-info">
                                            <h2>
                                                {currentUser.firstName} {currentUser.lastName}
                                                {currentUser.age && <span className="dev-age">{currentUser.age}</span>}
                                            </h2>
                                            {currentUser.about && <p className="dev-about">{currentUser.about}</p>}
                                        </div>
                                        
                                        {currentUser.skills && currentUser.skills.length > 0 && (
                                            <div className="dev-skills">
                                                {currentUser.skills.map((skill, i) => (
                                                    <span key={i} className="skill-tag">{skill}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="feed-actions">
                                    <button 
                                        className="feed-btn pass-btn" 
                                        onClick={() => handleAction("ignored", currentUser._id)}
                                    >
                                        <FiX size={32} />
                                    </button>
                                    <button 
                                        className="feed-btn like-btn" 
                                        onClick={() => handleAction("interested", currentUser._id)}
                                    >
                                        <FiHeart size={32} fill="currentColor" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="feed-empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h2>Empty Feed</h2>
                                <p>No more developers found at the moment. Try checking back later!</p>
                                <button className="refresh-btn" onClick={fetchFeed}>
                                    <FiRefreshCw size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                    Refresh Feed
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Home;