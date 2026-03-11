import { Routes, Route } from "react-router";
import "./App.css";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup"; // Import the new Signup component

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}
