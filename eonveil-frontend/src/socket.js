import { io } from "socket.io-client";

const socket = io("https://eonveil-room-system.onrender.com");  // This connects to the backend server

export default socket;
