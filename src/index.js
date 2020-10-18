const UDPClient = require('./client');
const UDPServer = require("./server");

/* Configuration defaults */
const serverDefaults = {
  type: 'udp4',
  reuseAddr: 'false'
};

const clientDefaults = {
  type: 'udp4',
  reuseAddr: 'false',
  address: '127.0.0.1',
  port: '80',
  connectionTimeout: 5000,
  connectionRetry: 0         // 0 means no retry
};

exports.createUDPServer = (options = serverDefaults) => {
  options = {
    ...serverDefaults,
    ...options
  };
  const server = new UDPServer(options);
  return server;
};

exports.createUDPClient = (options = clientDefaults) => {
  options = {
    ...clientDefaults,
    ...options
  }
  const client = new UDPClient(options);
  return client;
};