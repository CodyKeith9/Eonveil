import React, { useState } from "react";
import socket from "../socket";

function UsernameForm({ onUsernameSet }) {
    const [username, setUsername] = useState("");

    const submitUsername = () => {
        if (username.trim() !== "") {
            socket.emit("setUsername", { username });
            onUsernameSet(username);
        }
    };

    return (
        <div>
            <h2>🌌 Enter Your Name</h2>
            <input
                type="text"
                placeholder="Your name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={submitUsername}>Enter</button>
        </div>
    );
}

export default UsernameForm;