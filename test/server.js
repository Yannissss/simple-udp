const udp = require('../src/');

const server = udp.createUDPServer();

server.on('close', () => {
  console.log("Good bye!");
})

server.on('message', (msg, conn) => {
  console.log("Server: ", msg.toString());
  conn.send(msg);
})

server.listen(65255);