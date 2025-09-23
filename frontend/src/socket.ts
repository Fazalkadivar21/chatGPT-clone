import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

const token = sessionStorage.getItem("token");

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth:{
    token
  }
});

socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from socket server');
});