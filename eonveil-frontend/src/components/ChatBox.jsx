import React, { useState, useEffect } from "react";
import socket from "../socket";

function ChatBox({ roomCode, username }) {
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);

    // Load chat history when joining the room
    useEffect(() => {
        socket.on("loadChatHistory", (history) => {
            console.log("Chat history received:", history);
            setChatMessages([...history]); // Ensure state updates
        });

        socket.on("receiveMessage", (chatMessage) => {
            console.log("New message received from server:", chatMessage);
            setChatMessages((prevMessages) => [...prevMessages, chatMessage]); // Force re-render
        });

        return () => {
            socket.off("loadChatHistory");
            socket.off("receiveMessage");
        };
    }, []);

    // Send message to the server
    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() !== "") {
            console.log("Sending message:", { roomCode, username, message }); // Debugging log
            socket.emit("sendMessage", { roomCode, username, message });

            // Immediately update local state for instant feedback
            const chatMessage = {
                username: username,
                message: message,
                timestamp: new Date().toLocaleTimeString(),
            };
            setChatMessages((prevMessages) => [...prevMessages, chatMessage]);

            setMessage(""); // Clear input field
        }
    };

    return (
        <div className="chat-container">
            <h3>📜 In-Room Chat</h3>
            <div className="chat-box">
                {chatMessages.length === 0 ? (
                    <p>No messages yet...</p>
                ) : (
                    chatMessages.map((msg, index) => (
                        <div key={index} className="chat-message">
                            <strong>{msg.username}</strong> [{msg.timestamp}]: {msg.message}
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default ChatBox;