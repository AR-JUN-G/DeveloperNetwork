import { Routes, Route, Navigate } from "react-router";
import "./App.css";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Chat from "./Components/Chat/Chat";
import Home from "./Components/Home/Home";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import AppLayout from "./Components/AppLayout/AppLayout";
import Activity from "./Components/Activity/Activity";
import Profile from "./Components/Profile/Profile";
import { SocketProvider } from "./Context/SocketProvider";

export function App() {
  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route path="/home" element={<Home />} />
          <Route path="/direct/inbox" element={<Chat />} />
          <Route path="/direct/inbox/:toUserID" element={<Chat />} />

          <Route path="/requests" element={<Activity />} />

          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </SocketProvider>
  );
}
