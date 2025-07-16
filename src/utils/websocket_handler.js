const { WebSocket } = require('ws');

let websocket;

function handleWebSocketConnection(ws, req) {
  console.log('Client connected');
  websocket = ws;

  ws.send('Hello from WebSocket server!');

  ws.on('message', function incoming(message) {
    const receivedMessage = message.toString('utf8');
    console.log('Received message from client:', receivedMessage);
  });

  ws.on('message', async function message(message) {
    const dataString = message.toString('utf8');
    const data = JSON.parse(dataString);
  });
}
module.exports = { handleWebSocketConnection };
