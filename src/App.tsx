import { Routes, Route, Navigate } from "react-router";
import "./App.css";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Chat from "./Components/Chat/Chat";
import Home from "./Components/Home/Home";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import AppLayout from "./Components/AppLayout/AppLayout";

export function App() {
  return (
    <>
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

          <Route path="/requests" element={
            <div style={{ padding: '40px', color: '#fff' }}>
              <h1>Friend Requests & Suggestions</h1>
              <p>Coming soon: Manage your developer connections here.</p>
            </div>
          } />

          <Route path="/profile" element={
            <div style={{ padding: '40px', color: '#fff' }}>
              <h1>Edit Profile</h1>
              <p>Coming soon: Update your tech stack and personal info.</p>
            </div>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}
