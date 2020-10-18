const udp = require("../src");

const client = udp.createUDPClient({
  port: 65255
})

client.on('message', (msg) => {
  console.log("GOT", msg.toString());
  setTimeout(() => client.send(msg), 2500);
});

client.connect(() => {
  client.send("Hello!");
});