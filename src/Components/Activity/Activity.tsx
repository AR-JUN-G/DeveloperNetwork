import "./Activity.css";
import { useEffect, useState } from "react";
import { ReceivedRequestType } from "../../Types/ActivityAPI.types";
import { getAllReceivedRequests, reviewReceivedRequest } from "../../API/ActivityAPI";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";
import { useSocket } from "../../Context/SocketProvider";

const Activity = () => {
    const { socket } = useSocket();
    const [receivedRequests, setReceivedRequests] = useState<ReceivedRequestType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReceivedRequests = async () => {
        try {
            setIsLoading(true);
            const response = await getAllReceivedRequests();
            if (response.status === 200 && response.data) {
                setReceivedRequests(response.data.requests);
            }
        } catch (error) {
            console.error(error, "Error occurred while fetching the Request List");
        } finally {
            setIsLoading(false);
        }
    }

    const handleReview = async (status: "accepted" | "rejected", requestId: string) => {
        try {
            const response = await reviewReceivedRequest(status, requestId);
            if (response.status === 200) {
                // Optimistically update UI
                setReceivedRequests(prev => prev.filter(req => req._id !== requestId));
            }
        } catch (error) {
            console.error("Error reviewing request:", error);
        }
    }

    useEffect(() => {
        fetchReceivedRequests();

        if (socket) {
            socket.on("requestReceived", () => {
                console.log("Real-time request received! Refreshing...");
                fetchReceivedRequests();
            });

            return () => {
                socket.off("requestReceived");
            };
        }
    }, [socket])

    return (
        <div className="activity-page">
            <header className="activity-header">
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    Connection Requests
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    Review developers who want to connect with you.
                </motion.p>
            </header>

            {isLoading ? (
                <div className="loading-spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="requests-list">
                    <AnimatePresence mode="popLayout">
                        {receivedRequests.length > 0 ? (
                            receivedRequests.map((req, index) => (
                                <motion.div 
                                    key={req._id}
                                    className="request-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                >
                                    <div className="request-user-info">
                                        <img 
                                            src={req.fromUserID.photourl || `https://ui-avatars.com/api/?name=${req.fromUserID.firstName}+${req.fromUserID.lastName}&background=6366f1&color=fff`} 
                                            alt={req.fromUserID.firstName} 
                                            className="request-avatar" 
                                        />
                                        <div className="request-details">
                                            <h3>{req.fromUserID.firstName} {req.fromUserID.lastName}</h3>
                                            <p>Wants to connect with you</p>
                                        </div>
                                    </div>
                                    <div className="request-actions">
                                        <button 
                                            className="action-btn reject-btn" 
                                            onClick={() => handleReview("rejected", req._id)}
                                            title="Ignore"
                                        >
                                            <FiX size={20} />
                                        </button>
                                        <button 
                                            className="action-btn accept-btn" 
                                            onClick={() => handleReview("accepted", req._id)}
                                            title="Accept"
                                        >
                                            <FiCheck size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                className="empty-state"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <span className="empty-icon">📫</span>
                                <h2>No active requests</h2>
                                <p>You're all caught up! New requests will appear here.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}

export default Activity;