import React, { useState } from "react";
import socket from "../socket";

function RoomForm({ onRoomJoin }) {
    const [roomCode, setRoomCode] = useState("");
    const [roomName, setRoomName] = useState("");

    const createRoom = () => {
        if (roomName.trim() !== "") {
            const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            console.log(`🎲 Creating Room: ${roomName} with Code: ${newRoomCode}`);

            socket.emit("createRoom", { roomCode: newRoomCode, roomName });

            socket.once("roomCreated", ({ success, roomCode }) => {
                if (success) {
                    console.log(`✅ Room created successfully: ${roomCode}`);
                    onRoomJoin(roomCode);
                } else {
                    alert("❌ Room creation failed.");
                }
            });
        }
    };

    const joinRoom = () => {
        if (roomCode.trim() !== "") {
            console.log(`🔗 Attempting to join room: ${roomCode}`);
            socket.emit("joinRoom", { roomCode });

            socket.once("roomJoined", ({ success }) => {
                if (success) {
                    console.log(`✅ Successfully joined room: ${roomCode}`);
                    onRoomJoin(roomCode);
                } else {
                    alert("❌ Failed to join room. The room code may be incorrect.");
                }
            });
        }
    };

    return (
        <div className="room-container">
            {/* Join Room Section */}
            <div className="room-section">
                <h3>🔗 Join an Existing Room</h3>
                <input
                    type="text"
                    placeholder="Enter Room Code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                />
                <button onClick={joinRoom}>Join Room</button>
            </div>

            <div className="room-divider"></div>

            {/* Create Room Section */}
            <div className="room-section">
                <h3>🏰 Create a New Realm</h3>
                <input
                    type="text"
                    placeholder="Enter Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <button onClick={createRoom}>Create Room</button>
            </div>
        </div>
    );
}

export default RoomForm;


