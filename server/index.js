const express = require('express')
const { WebSocketServer } = require('ws')
const http = require('http')

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  console.log('WebSocket connected')

  ws.on('message', (msg) => {
    console.log('Received:', msg.toString())
    console.log('Active clients', wss.clients.size)
    if(JSON.parse(msg).type === 'ping') return;
    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === client.OPEN) {
        client.send(msg.toString())
        console.log('Sent:', msg.toString())
      }
    })
  })
})

app.get('/', (req, res) => {
  res.send('Server is running')
})

server.listen(3333, () => {
  console.log('Server listening on http://localhost:3333')
})
