import React, { useState, useEffect } from "react";
import UsernameForm from "./components/UsernameForm";
import RoomForm from "./components/RoomForm";
import DiceRoller from "./components/DiceRoller";
import CharacterStats from "./components/CharacterStats";
import ChatBox from "./components/ChatBox";
import "./index.css";
import { io } from "socket.io-client";

import socket from "./socket";

function App() {
    const [username, setUsername] = useState(() => localStorage.getItem("username") || null);
    const [roomCode, setRoomCode] = useState(null);
    const [role, setRole] = useState("Player*"); // Default role

    useEffect(() => {
        socket.on("assignRole", ({ userId, role }) => {
            console.log(`Role received from server: ${role} (UserID: ${userId})`);

            if (socket.id === userId) {
                setRole(role);
                localStorage.setItem("userRole", role); // Save role to prevent UI delay
            }
        });

        return () => {
            socket.off("assignRole");
        };
    }, []);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            console.log("Restoring role from localStorage:", storedRole);
            setRole(storedRole);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("roomCode");
        setUsername(null);
        setRoomCode(null);
    };

    return (
        <div className="container">
            <h1 className="title">⚔️ Eonveil: The Gathering Storm ⚔️</h1>
            <p className="subtitle">🌌 The echoes of battle await...</p>

            {!username ? (
                <UsernameForm onUsernameSet={(newUsername) => {
                    localStorage.setItem("username", newUsername);
                    setUsername(newUsername);
                }} />
            ) : !roomCode ? (
                <RoomForm onRoomJoin={(newRoomCode) => {
                    localStorage.setItem("roomCode", newRoomCode);
                    setRoomCode(newRoomCode);
                }} />
            ) : (
                <div className="game-container">
                    <h2>Room Code: {roomCode}</h2>
                    <p>🌟 Welcome, {username}! You are <strong>{role}</strong></p>

                    <div className="game-panel">
                        <DiceRoller roomCode={roomCode} />
                        <CharacterStats roomCode={roomCode} />
                        <ChatBox roomCode={roomCode} username={username} />
                    </div>

                    <div className="button-container">
                        <button className="leave-realm" onClick={() => {
                            setRoomCode(null);
                            localStorage.removeItem("roomCode");
                        }}>
                            🏰 Leave the Realm
                        </button>

                        <button className="logout-button" onClick={handleLogout}>
                            🚪 Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;









