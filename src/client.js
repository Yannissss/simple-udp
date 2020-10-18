const dgram = require("dgram");
const { debug, UDPError, noop } = require("./util");

/* UDP Server class */
module.exports = class UDPClient {
  constructor(options) {
    // Socket configuration
    this.address = options.address;
    this.port = options.port;
    this.connectionTimeout = options.connectionTimeout;
    this.connectionRetry = options.connectionRetry;
    this.connected = false;
    this.closed = false;
    this.socket = dgram.createSocket({
      type: options.type,
      reuseAddr: options.reuseAddr,
    });
    // Default Listeners
    this.onConnect = noop;
    this.onDisconnect = noop;
    this.onClose = noop;
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
      const { size } = rinfo;
      debug("Incoming message from socket / %d", size);
      this.onMessage(msg);
    });
    this.socket.on("connect", () => {
      const { address, port } = this.socket.remoteAddress();
      debug("Client connected to %s:%d", address, port);
      this.connected = true;
    });
    this.socket.on("disconnect", () => {
      debug("Client got disconnected");
      const retries = this.connectionRetry;
      if (retries > 0) {
        this.connect();
        
      }
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
      case "connect":
        this.onConnect = listener || noop;
        break;
      case "disconnect":
        this.onDisconnect = listener || noop;
        break;
      default:
        throw new UDPError("Unknown event, " + event);
    }
  }

  connect(callback) {
    debug("Attempting to connect to %s:%d", this.address, this.port);
    this.socket.connect(this.port, this.address, callback || noop);
  }

  disconnect() {
    this.socket.disconnect();
  }

  send(msg, callback) {
    if (this.closed)
      throw new UDPError("Client socket is closed!");
    if (!this.connected)
      throw new UDPError("Client socket is not connected!");
    this.socket.send(msg, callback ||noop);
  }

  close() {
    this.socket.close();
  }
};
