import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000/rideStatus";
const GLOBAL_KEY = "__rideapp_socket__";

const socket =
  globalThis[GLOBAL_KEY] ||
  (globalThis[GLOBAL_KEY] = io(SOCKET_URL, {
    autoConnect: false,
  }));

export default socket;
