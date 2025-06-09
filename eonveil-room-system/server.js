const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    "https://CodyKeith9.github.io",  // GitHub Pages frontend
    "https://eonveil.onrender.com"   // Optional: Render
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Store room data
let rooms = {};
let playerStats = {};
let playerUsernames = {};
let roomDMs = {};

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
            roomDMs[roomCode] = socket.id;
        }

        console.log(`✅ Room "${roomName}" created with code: ${roomCode}. DM assigned: ${socket.id}`);
        socket.emit("roomCreated", { roomCode, success: true });
    });

    // Handle joining a room
    socket.on("joinRoom", ({ roomCode }) => {
        if (rooms[roomCode]) {
            rooms[roomCode].push(socket.id);
            socket.join(roomCode);

            console.log(`✅ User ${socket.id} joined room ${roomCode}`);
            socket.emit("roomJoined", { success: true, roomCode });

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

    // ✅ Real-time chat broadcasting
    socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", {
            username: data.username,
            message: data.message,
            timestamp: new Date().toLocaleTimeString()
        });
    });

    // Handle disconnecting
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        for (const roomCode in rooms) {
            rooms[roomCode] = rooms[roomCode].filter((id) => id !== socket.id);
            io.to(roomCode).emit("updatePlayers", rooms[roomCode]);

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
app.get("/", (req, res) => {
    res.send("🟢 Eonveil backend is live! Socket server is running.");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://192.168.68.62:${PORT}`);
});
