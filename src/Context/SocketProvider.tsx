import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = useSelector((state: RootState) => state.User);

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!user?.userID) return;

        const newSocket = io("http://localhost:7777", {
            query: { userID: user.userID }
        });

        newSocket.on("connect", () => {
            console.log("Global Socket Connected:", newSocket.id);
        });

        setSocket(newSocket);

        return () => {
            console.log("Disconnecting Global Socket...");
            newSocket.disconnect();
        };

    }, [user.userID]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
