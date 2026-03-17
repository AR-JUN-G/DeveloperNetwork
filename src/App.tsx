import { Routes, Route } from "react-router";
import "./App.css";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup"; // Import the new Signup component
import Chat from "./Components/Chat/Chat";
import Home from "./Components/Home/Home";

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Routes>
    </>
  );
}
