const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store room data
let rooms = {}; // Tracks players in each room
let playerStats = {}; // Tracks player stats
let playerUsernames = {}; // Tracks usernames
let roomDMs = {}; // Tracks the DM for each room

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle setting username
    socket.on("setUsername", ({ username }) => {
        playerUsernames[socket.id] = username;
        console.log(`User ${socket.id} set their username to: ${username}`);
    });

    // Handle creating a room
    socket.on("createRoom", ({ roomCode, roomName }) => {
        if (!rooms[roomCode]) {
            rooms[roomCode] = [];
            roomDMs[roomCode] = socket.id; // Assign the first player as DM*
        }
    
        console.log(`✅ Room "${roomName}" created with code: ${roomCode}. DM assigned: ${socket.id}`);
    
        // Send confirmation to the frontend
        socket.emit("roomCreated", { roomCode, success: true });
    });

    // Handle joining a room
    socket.on("joinRoom", ({ roomCode }) => {
        if (rooms[roomCode]) {
            rooms[roomCode].push(socket.id);
            socket.join(roomCode);
    
            console.log(`✅ User ${socket.id} joined room ${roomCode}`);
    
            // Send success confirmation to the frontend
            socket.emit("roomJoined", { success: true, roomCode });
    
            // Sync player data in the room
            io.to(roomCode).emit("updatePlayers", rooms[roomCode]);
            io.to(roomCode).emit("statsUpdate", playerStats);
            io.to(roomCode).emit("usernamesUpdate", playerUsernames);
        } else {
            console.error(`❌ Room ${roomCode} does not exist.`);
            socket.emit("roomJoined", { success: false });
        }
    });
    
    // Handle stat updates
    socket.on("updateStats", ({ roomCode, statType, value }) => {
        if (playerStats[socket.id]) {
            playerStats[socket.id][statType] = value;
            io.to(roomCode).emit("statsUpdate", playerStats);
        }
    });

    // Handle user disconnecting
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        for (const roomCode in rooms) {
            rooms[roomCode] = rooms[roomCode].filter((id) => id !== socket.id);
            io.to(roomCode).emit("updatePlayers", rooms[roomCode]);

            // If the DM disconnects, reassign a new DM (first person in the room)
            if (roomDMs[roomCode] === socket.id && rooms[roomCode].length > 0) {
                roomDMs[roomCode] = rooms[roomCode][0];
                io.to(roomCode).emit("assignRole", { userId: roomDMs[roomCode], role: "DM*" });
                console.log(`New DM* assigned: ${roomDMs[roomCode]}`);
            }
        }

        delete playerStats[socket.id];
        delete playerUsernames[socket.id];
        io.emit("statsUpdate", playerStats);
        io.emit("usernamesUpdate", playerUsernames);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://192.168.68.62:${PORT}`);
});
