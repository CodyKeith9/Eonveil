import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // This connects to the backend server

export default socket;
