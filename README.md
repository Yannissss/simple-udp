# simple-udp

UDP helper module for Node.js

# Usage

## Server setup

```javascript
const { createUDPServer } = require("simple-udp");

// Server object configuration / creation
const server = createUDPServer();

// Setup listener
server.on("message", (msg, conn) => {
  console.log("Received: " + msg.toString());
  conn.send("Got your message!");
});

// Bind server socket
server.listen(3000);
```

## Client usage

```javascript
const { createUDPClient } = require("simple-udp");

// Client object configuration / creation
const client = createUDPClient({
  address: "127.0.0.1",
  port: 3000,
});

client.connect(() => {
  client.send("Hello from the client!");
});
```
