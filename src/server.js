const dgram = require("dgram");
const { debug, UDPError, noop } = require("./util");

/* UDPConnection: Helper class to send back messages */
class UDPConnection {

  constructor(address, port, family, socket) {
    this.address = address;
    this.port = port;
    this.family = family;
    this.socket = socket;
  }

  send(buffer, callback) {
    this.socket.send(buffer, this.port, this.address, callback);
  }
}

/* UDP Server class */
module.exports = class UDPServer {
  constructor(options) {
    // Socket configuration
    this.port = -1;
    this.bound = false;
    this.closed = false;
    this.socket = dgram.createSocket({
      type: options.type,
      reuseAddr: options.reuseAddr,
    });
    // Default Listeners
    this.onClose = noop;
    this.onListening = noop;
    this.onMessage = noop;
    this.onError = (err) => {
      err.name = "UDPError";
      throw err;
    }
    // Registering listeners
    this.socket.on("error", (err) => {
      err.name = "UDPError";
      debug("Caught error: " + error);
      this.onError(err);
    });
    this.socket.on("close", () => {
      debug("Closing request...");  
      this.closed = true;
      this.onClose();
    });
    this.socket.on("message", (msg, rinfo) => {
      const { address, port, size, family } = rinfo;
      const conn = new UDPConnection(address, port, family, this.socket);
      debug("Incoming message from [%s/%d] / %d", address, port, size);
      this.onMessage(msg, conn);
    });
    this.socket.on("listening", () => {
      const { address, port } = this.socket.address();
      debug("Listening on %s/%d", address, port);
      this.onListening(port);
    });
  }

  on(event, listener) {
    switch (event) {
      case "error":
        this.onError = listener || noop;
        break;
      case "close":
        this.onClose = listener || noop;
        break;
      case "message":
        this.onMessage = listener || noop;
        break;
      case "listening":
        this.onListening = listener || noop;
        break;
      default:
        throw new UDPError("Unknown event, " + event);
    }
  }

  listen(port, callback) {
    if (!this.bound) {
      if (callback) this.on("listening", callback);
      this.socket.bind(port);
      this.port = port;
      this.bound = true;
    } else {
      throw new UDPError("Server is already listening on port " + this.port);
    }
  }

  send(msg, callback) {
    if (this.closed)
      throw new UDPError("Server socket is closed!");
    if (!this.bound)
      throw new UDPError("Server socket is not bound!");
    this.socket.send(msg, callback ||noop);
  }

  close() {
    this.socket.close();
  }
};
