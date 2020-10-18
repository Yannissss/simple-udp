const debug = require("debug");

const __debug = debug("simple-udp");
exports.debug = __debug;

exports.UDPError = class UDPError extends Error {};

exports.noop = () => undefined;
