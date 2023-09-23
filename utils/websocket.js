// utils/websocket.js

import { w3cwebsocket as WebSocketClient } from 'websocket';

const serverURL = 'ws://sock.zkl.app/session/'; // The base URL, you'll append address when connecting


let connection; // Variable to store the WebSocket connection

function connectWebSocket(address) {
    connection = new WebSocketClient(serverURL + address, 'echo-protocol');

    console.log('Connecting to WebSocket server...' + serverURL + address);
  
    connection.onopen = () => {
      console.log('Connected to WebSocket server');
  
      connection.onmessage = (message) => {
        console.log('Received message:', message.data);
      };
  
      connection.onclose = () => {
        console.log('WebSocket connection closed');
      };
    };
  
    connection.onerror = (error) => {
      console.error('WebSocket connection error:', error);
    };
  }
  
function emitData(data) {
  if (connection && connection.connected) {
    connection.sendUTF(JSON.stringify(data));
  }
}

export { connectWebSocket, emitData };
