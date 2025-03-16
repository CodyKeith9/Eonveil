import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // This connects to your backend server

export default socket;
